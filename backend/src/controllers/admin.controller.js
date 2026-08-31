const fs = require('fs').promises;
const path = require('path');
const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const UPLOAD_DIR = path.join(__dirname, '../../storage/uploads/admin');

// Ensure upload directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

// ===== DASHBOARD & STATS =====

exports.getStats = async (req, res) => {
    try {
        const filesResult = await db.query('SELECT COUNT(*) as count FROM (SELECT DISTINCT name FROM admin_files) as t');
        const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
        const dbSizeResult = await db.query('SELECT pg_size_pretty(pg_database_size(current_database())) as size');

        successResponse(res, 200, 'Stats retrieved', {
            totalFiles: parseInt(filesResult.rows[0]?.count || 0),
            totalUsers: parseInt(usersResult.rows[0]?.count || 0),
            dbSize: dbSizeResult.rows[0]?.size || '0 MB',
            status: 'online'
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        errorResponse(res, 500, 'Failed to get stats');
    }
};

exports.getActivityLog = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit || 20);
        const result = await db.query(
            'SELECT action, timestamp FROM admin_activity ORDER BY timestamp DESC LIMIT $1',
            [limit]
        );

        successResponse(res, 200, 'Activity log retrieved', result.rows);
    } catch (error) {
        console.error('Error getting activity log:', error);
        errorResponse(res, 500, 'Failed to get activity log');
    }
};

// ===== FILE MANAGEMENT =====

exports.listFiles = async (req, res) => {
    try {
        const result = await db.query(`
      SELECT id, name, type, size, uploaded_at as "uploadedAt", uploaded_by
      FROM admin_files
      ORDER BY uploaded_at DESC
    `);

        successResponse(res, 200, 'Files retrieved', result.rows);
    } catch (error) {
        console.error('Error listing files:', error);
        errorResponse(res, 500, 'Failed to list files');
    }
};

exports.getFile = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM admin_files WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return errorResponse(res, 404, 'File not found');
        }

        const file = result.rows[0];
        const filePath = path.join(UPLOAD_DIR, file.file_path);

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            file.content = content;
        } catch (err) {
            file.content = '[Binary file or unable to read]';
        }

        successResponse(res, 200, 'File retrieved', file);
    } catch (error) {
        console.error('Error getting file:', error);
        errorResponse(res, 500, 'Failed to get file');
    }
};

exports.uploadFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return errorResponse(res, 400, 'No files provided');
        }

        const uploadedFiles = [];

        for (const file of req.files) {
            const fileId = Math.random().toString(36).substr(2, 9);
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(UPLOAD_DIR, fileName);

            await fs.writeFile(filePath, file.buffer);

            const result = await db.query(`
        INSERT INTO admin_files (id, name, type, size, file_path, uploaded_by)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, name, type, size, uploaded_at
      `, [fileId, file.originalname, file.mimetype, file.size, fileName, req.user.id]);

            uploadedFiles.push(result.rows[0]);

            // Log activity
            await db.query(`
        INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
      `, [req.user.id, `Uploaded file: ${file.originalname}`]);
        }

        successResponse(res, 201, 'Files uploaded successfully', uploadedFiles);
    } catch (error) {
        console.error('Error uploading files:', error);
        errorResponse(res, 500, 'Failed to upload files');
    }
};

exports.updateFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, content } = req.body;

        const fileResult = await db.query('SELECT file_path FROM admin_files WHERE id = $1', [id]);
        if (fileResult.rows.length === 0) {
            return errorResponse(res, 404, 'File not found');
        }

        const filePath = path.join(UPLOAD_DIR, fileResult.rows[0].file_path);

        if (content !== undefined) {
            await fs.writeFile(filePath, content);
        }

        const result = await db.query(`
      UPDATE admin_files
      SET name = COALESCE($1, name)
      WHERE id = $2
      RETURNING id, name, type, size, uploaded_at
    `, [name, id]);

        // Log activity
        await db.query(`
      INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
    `, [req.user.id, `Updated file: ${name}`]);

        successResponse(res, 200, 'File updated successfully', result.rows[0]);
    } catch (error) {
        console.error('Error updating file:', error);
        errorResponse(res, 500, 'Failed to update file');
    }
};

exports.deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        const fileResult = await db.query('SELECT file_path, name FROM admin_files WHERE id = $1', [id]);
        if (fileResult.rows.length === 0) {
            return errorResponse(res, 404, 'File not found');
        }

        const filePath = path.join(UPLOAD_DIR, fileResult.rows[0].file_path);
        const fileName = fileResult.rows[0].name;

        try {
            await fs.unlink(filePath);
        } catch (err) {
            console.warn('File already deleted from disk:', err.message);
        }

        await db.query('DELETE FROM admin_files WHERE id = $1', [id]);

        // Log activity
        await db.query(`
      INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
    `, [req.user.id, `Deleted file: ${fileName}`]);

        successResponse(res, 200, 'File deleted successfully');
    } catch (error) {
        console.error('Error deleting file:', error);
        errorResponse(res, 500, 'Failed to delete file');
    }
};

// ===== DATABASE MANAGEMENT =====

exports.getDatabaseStats = async (req, res) => {
    try {
        const tableCount = await db.query(`
      SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'
    `);

        const recordCount = await db.query(`
      SELECT SUM(n_live_tup) as count FROM pg_stat_user_tables
    `);

        const lastBackup = await db.query(`
      SELECT timestamp FROM admin_backups ORDER BY timestamp DESC LIMIT 1
    `);

        successResponse(res, 200, 'Database stats retrieved', {
            tableCount: parseInt(tableCount.rows[0]?.count || 0),
            recordCount: parseInt(recordCount.rows[0]?.count || 0),
            lastBackup: lastBackup.rows[0]?.timestamp || null
        });
    } catch (error) {
        console.error('Error getting database stats:', error);
        errorResponse(res, 500, 'Failed to get database stats');
    }
};

exports.createBackup = async (req, res) => {
    try {
        const timestamp = new Date().toISOString();
        const backupName = `backup-${timestamp.split('T')[0]}-${Date.now()}.sql`;

        // Record backup in database
        await db.query(`
      INSERT INTO admin_backups (name, timestamp) VALUES ($1, $2)
    `, [backupName, timestamp]);

        // Log activity
        await db.query(`
      INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
    `, [req.user.id, 'Created database backup: ' + backupName]);

        successResponse(res, 201, 'Backup created successfully', {
            name: backupName,
            timestamp: timestamp
        });
    } catch (error) {
        console.error('Error creating backup:', error);
        errorResponse(res, 500, 'Failed to create backup');
    }
};

exports.exportDatabase = async (req, res) => {
    try {
        const result = await db.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `);

        const tables = result.rows.map(r => r.table_name);
        const exportData = {};

        for (const table of tables) {
            const tableData = await db.query(`SELECT * FROM ${table}`);
            exportData[table] = tableData.rows;
        }

        // Log activity
        await db.query(`
      INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
    `, [req.user.id, 'Exported database']);

        res.json(exportData);
    } catch (error) {
        console.error('Error exporting database:', error);
        errorResponse(res, 500, 'Failed to export database');
    }
};

exports.executeQuery = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== 'string') {
            return errorResponse(res, 400, 'Invalid query');
        }

        // Only allow SELECT queries for safety
        if (!query.trim().toUpperCase().startsWith('SELECT')) {
            return errorResponse(res, 403, 'Only SELECT queries are allowed');
        }

        const result = await db.query(query);

        // Log activity
        await db.query(`
      INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
    `, [req.user.id, 'Executed query']);

        successResponse(res, 200, 'Query executed', result.rows);
    } catch (error) {
        console.error('Error executing query:', error);
        errorResponse(res, 500, 'Query execution failed', {
            code: 'QUERY_ERROR',
            message: error.message
        });
    }
};

// ===== USER MANAGEMENT =====

exports.listUsers = async (req, res) => {
    try {
        const result = await db.query(`
      SELECT id, email, full_name, role, status, created_at
      FROM users
      ORDER BY created_at DESC
    `);

        successResponse(res, 200, 'Users retrieved', result.rows);
    } catch (error) {
        console.error('Error listing users:', error);
        errorResponse(res, 500, 'Failed to list users');
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT id, email, full_name, role, status, created_at FROM users WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return errorResponse(res, 404, 'User not found');
        }

        successResponse(res, 200, 'User retrieved', result.rows[0]);
    } catch (error) {
        console.error('Error getting user:', error);
        errorResponse(res, 500, 'Failed to get user');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        const result = await db.query(`
      UPDATE users
      SET role = COALESCE($1, role), status = COALESCE($2, status)
      WHERE id = $3
      RETURNING id, email, full_name, role, status, created_at
    `, [role, status, id]);

        if (result.rows.length === 0) {
            return errorResponse(res, 404, 'User not found');
        }

        // Log activity
        await db.query(`
      INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
    `, [req.user.id, `Updated user: ${result.rows[0].email}`]);

        successResponse(res, 200, 'User updated successfully', result.rows[0]);
    } catch (error) {
        console.error('Error updating user:', error);
        errorResponse(res, 500, 'Failed to update user');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userResult = await db.query('SELECT email FROM users WHERE id = $1', [id]);
        if (userResult.rows.length === 0) {
            return errorResponse(res, 404, 'User not found');
        }

        const userEmail = userResult.rows[0].email;

        await db.query('DELETE FROM users WHERE id = $1', [id]);

        // Log activity
        await db.query(`
      INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
    `, [req.user.id, `Deleted user: ${userEmail}`]);

        successResponse(res, 200, 'User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        errorResponse(res, 500, 'Failed to delete user');
    }
};

// ===== SETTINGS =====

exports.getSettings = async (req, res) => {
    try {
        const result = await db.query('SELECT key, value FROM admin_settings');
        const settings = {};
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });

        successResponse(res, 200, 'Settings retrieved', settings);
    } catch (error) {
        console.error('Error getting settings:', error);
        errorResponse(res, 500, 'Failed to get settings');
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { appName, environment, enableMFA, enableAudit } = req.body;

        const updates = [
            { key: 'appName', value: appName },
            { key: 'environment', value: environment },
            { key: 'enableMFA', value: String(enableMFA) },
            { key: 'enableAudit', value: String(enableAudit) }
        ];

        for (const { key, value } of updates) {
            if (value !== undefined) {
                await db.query(`
          INSERT INTO admin_settings (key, value)
          VALUES ($1, $2)
          ON CONFLICT (key) DO UPDATE SET value = $2
        `, [key, value]);
            }
        }

        // Log activity
        await db.query(`
      INSERT INTO admin_activity (user_id, action) VALUES ($1, $2)
    `, [req.user.id, 'Updated settings']);

        successResponse(res, 200, 'Settings updated successfully');
    } catch (error) {
        console.error('Error updating settings:', error);
        errorResponse(res, 500, 'Failed to update settings');
    }
};
