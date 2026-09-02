/* ===========================
   Admin Dashboard JavaScript
   =========================== */

class AdminDashboard {
    constructor() {
        this.apiBaseUrl = '/api/admin';
        this.token = this.getStoredToken();
        this.user = this.getStoredUser();
        this.currentEditingFile = null;
        this.refreshTimer = null;

        this.init();
    }

    getStoredToken() {
        return localStorage.getItem('gibi_token') || localStorage.getItem('authToken') || '';
    }

    getStoredUser() {
        const rawUser = localStorage.getItem('gibi_user') || localStorage.getItem('user') || '{}';
        try {
            return JSON.parse(rawUser);
        } catch (error) {
            return {};
        }
    }

    init() {
        if (!this.token || !this.user || !['admin', 'moderator'].includes((this.user.role || '').toLowerCase())) {
            this.showToast('Admin access required. Please sign in with an admin account.', 'error');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1200);
            return;
        }

        this.setupEventListeners();
        this.loadDashboard();
        this.loadSettings();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.switchSection(e));
        });

        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('active');
            });
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());

        // File Manager
        document.getElementById('uploadBtn')?.addEventListener('click', () => {
            document.getElementById('uploadArea').style.display = 'block';
        });

        document.getElementById('cancelUploadBtn')?.addEventListener('click', () => {
            document.getElementById('uploadArea').style.display = 'none';
        });

        document.getElementById('refreshBtn')?.addEventListener('click', () => this.loadFiles());

        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.addEventListener('click', () => document.getElementById('fileInput').click());
            dropZone.addEventListener('dragover', (e) => e.preventDefault());
            dropZone.addEventListener('drop', (e) => this.handleFileDrop(e));
        }

        document.getElementById('fileInput')?.addEventListener('change', (e) => this.handleFileSelect(e));

        // Search
        document.getElementById('searchFiles')?.addEventListener('input', (e) => this.filterFiles(e.target.value));
        document.getElementById('searchUsers')?.addEventListener('input', (e) => this.filterUsers(e.target.value));
        document.getElementById('roleFilter')?.addEventListener('change', (e) => this.filterUsers(document.getElementById('searchUsers')?.value || ''));

        // Database
        document.getElementById('backupBtn')?.addEventListener('click', () => this.createBackup());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportData());
        document.getElementById('executeQueryBtn')?.addEventListener('click', () => this.executeQuery());

        // Settings
        document.getElementById('saveSettingsBtn')?.addEventListener('click', () => this.saveSettings());
        document.getElementById('resetSettingsBtn')?.addEventListener('click', () => this.resetSettings());

        // Modal
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        document.getElementById('cancelBtnFile')?.addEventListener('click', () => this.closeModal());
        document.getElementById('saveBtnFile')?.addEventListener('click', () => this.saveFileEdit());
    }

    switchSection(e) {
        e.preventDefault();

        const section = e.target.dataset.section;
        if (!section) return;

        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        e.target.classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById(section)?.classList.add('active');

        // Update title
        const titles = {
            dashboard: 'Dashboard',
            files: 'File Manager',
            database: 'Database Management',
            users: 'User Management',
            settings: 'Settings'
        };
        document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';

        // Load section data
        if (section === 'files') this.loadFiles();
        if (section === 'users') this.loadUsers();
        if (section === 'database') this.loadDatabaseStats();
    }

    // ===== DASHBOARD =====
    async loadDashboard() {
        try {
            this.updateUserInfo();
            this.loadDashboardStats();
            this.loadActivityLog();
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    updateUserInfo() {
        const userName = this.user.full_name || this.user.name || this.user.email || 'Admin';
        const userRole = this.user.role || 'admin';
        document.getElementById('userInfo').textContent = `${userName} (${userRole})`;
    }

    async loadDashboardStats() {
        try {
            const response = await this.apiCall('/stats');
            const stats = response.data;

            document.getElementById('totalFiles').textContent = stats.totalFiles || '0';
            document.getElementById('totalUsers').textContent = stats.totalUsers || '0';
            document.getElementById('dbSize').textContent = stats.dbSize || '0 MB';
            document.getElementById('systemStatus').textContent = stats.status === 'online' ? '✓ Online' : '✗ Offline';
        } catch (error) {
            console.warn('Could not load stats:', error);
        }
    }

    async loadActivityLog() {
        try {
            const response = await this.apiCall('/activity?limit=10');
            const activities = response.data || [];

            const activityLog = document.getElementById('activityLog');
            activityLog.innerHTML = activities.map(activity =>
                `<div class="activity-item">[${new Date(activity.timestamp).toLocaleTimeString()}] ${activity.action}</div>`
            ).join('') || '<p>No recent activity</p>';
        } catch (error) {
            console.warn('Could not load activity log:', error);
        }
    }

    // ===== FILE MANAGER =====
    async loadFiles() {
        try {
            const response = await this.apiCall('/files');
            const files = response.data || [];

            const tableBody = document.getElementById('fileTableBody');
            tableBody.innerHTML = files.map(file => `
        <tr>
          <td>${this.truncateString(file.name, 50)}</td>
          <td>${file.type || 'unknown'}</td>
          <td>${this.formatFileSize(file.size)}</td>
          <td>${new Date(file.uploadedAt).toLocaleDateString()}</td>
          <td>
            <div class="file-actions-cell">
              <button class="action-btn edit" onclick="admin.editFile('${file.id}')">✎ Edit</button>
              <button class="action-btn delete" onclick="admin.deleteFile('${file.id}', '${file.name}')">✕ Delete</button>
            </div>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="5">No files found</td></tr>';

            this.showToast('Files loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading files:', error);
            this.showToast('Failed to load files', 'error');
        }
    }

    handleFileDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        this.uploadFiles(files);
    }

    handleFileSelect(e) {
        const files = e.target.files;
        this.uploadFiles(files);
    }

    async uploadFiles(files) {
        if (!files.length) return;

        const formData = new FormData();
        for (let file of files) {
            formData.append('files', file);
        }

        try {
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    this.updateProgressBar(percentComplete);
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200 || xhr.status === 201) {
                    this.showToast('Files uploaded successfully', 'success');
                    document.getElementById('uploadArea').style.display = 'none';
                    this.loadFiles();
                }
            });

            xhr.addEventListener('error', () => {
                this.showToast('Upload failed', 'error');
            });

            xhr.open('POST', this.apiBaseUrl + '/upload');
            xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
            xhr.send(formData);

            document.getElementById('uploadProgress').style.display = 'block';
        } catch (error) {
            console.error('Error uploading files:', error);
            this.showToast('Upload error: ' + error.message, 'error');
        }
    }

    updateProgressBar(percent) {
        document.getElementById('progressBar').style.setProperty('--progress', percent + '%');
        document.getElementById('progressText').textContent = Math.round(percent) + '%';
    }

    filterFiles(searchTerm) {
        const rows = document.querySelectorAll('#fileTableBody tr');
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm.toLowerCase()) ? '' : 'none';
        });
    }

    async editFile(fileId) {
        try {
            const response = await this.apiCall(`/files/${fileId}`);
            const file = response.data;

            this.currentEditingFile = fileId;
            document.getElementById('editFileName').value = file.name;
            document.getElementById('editFileContent').value = file.content || '';
            document.getElementById('editModal').style.display = 'flex';
        } catch (error) {
            console.error('Error loading file:', error);
            this.showToast('Failed to load file', 'error');
        }
    }

    async saveFileEdit() {
        try {
            const fileName = document.getElementById('editFileName').value;
            const content = document.getElementById('editFileContent').value;

            await this.apiCall(`/files/${this.currentEditingFile}`, 'PUT', {
                name: fileName,
                content: content
            });

            this.showToast('File saved successfully', 'success');
            this.closeModal();
            this.loadFiles();
        } catch (error) {
            console.error('Error saving file:', error);
            this.showToast('Failed to save file', 'error');
        }
    }

    async deleteFile(fileId, fileName) {
        if (!confirm(`Delete "${fileName}"?`)) return;

        try {
            await this.apiCall(`/files/${fileId}`, 'DELETE');
            this.showToast('File deleted successfully', 'success');
            this.loadFiles();
        } catch (error) {
            console.error('Error deleting file:', error);
            this.showToast('Failed to delete file', 'error');
        }
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
    }

    // ===== DATABASE MANAGEMENT =====
    async loadDatabaseStats() {
        try {
            const response = await this.apiCall('/database/stats');
            const stats = response.data;

            document.getElementById('tableCount').textContent = stats.tableCount || '0';
            document.getElementById('recordCount').textContent = stats.recordCount || '0';
            document.getElementById('lastBackup').textContent = stats.lastBackup || 'Never';
        } catch (error) {
            console.warn('Could not load database stats:', error);
        }
    }

    async createBackup() {
        if (!confirm('Create database backup? This may take a moment.')) return;

        try {
            await this.apiCall('/database/backup', 'POST');
            this.showToast('Backup created successfully', 'success');
            this.loadDatabaseStats();
        } catch (error) {
            console.error('Error creating backup:', error);
            this.showToast('Failed to create backup', 'error');
        }
    }

    async exportData() {
        try {
            const response = await fetch(this.apiBaseUrl + '/database/export', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `gibiconnect-export-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            this.showToast('Data exported successfully', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showToast('Export failed', 'error');
        }
    }

    async executeQuery() {
        const query = document.getElementById('sqlQuery').value.trim();
        if (!query) {
            this.showToast('Enter a query', 'warning');
            return;
        }

        try {
            const response = await this.apiCall('/database/query', 'POST', { query });
            const result = response.data;

            document.getElementById('queryResult').innerHTML = `
        <pre>${JSON.stringify(result, null, 2)}</pre>
      `;
            this.showToast('Query executed successfully', 'success');
        } catch (error) {
            console.error('Error executing query:', error);
            document.getElementById('queryResult').innerHTML = `<pre style="color: red;">Error: ${error.message}</pre>`;
            this.showToast('Query execution failed', 'error');
        }
    }

    // ===== USER MANAGEMENT =====
    async loadUsers() {
        try {
            const response = await this.apiCall('/users');
            const users = response.data || [];

            const tableBody = document.getElementById('usersTableBody');
            tableBody.innerHTML = users.map(user => `
        <tr>
          <td>${user.full_name || 'N/A'}</td>
          <td>${user.email}</td>
          <td><span class="role-badge">${user.role}</span></td>
          <td>${user.status || 'active'}</td>
          <td>${new Date(user.created_at).toLocaleDateString()}</td>
          <td>
            <div class="file-actions-cell">
              <button class="action-btn edit" onclick="admin.editUser('${user.id}')">✎ Edit</button>
              <button class="action-btn delete" onclick="admin.deleteUser('${user.id}')">✕ Remove</button>
            </div>
          </td>
        </tr>
      `).join('') || '<tr><td colspan="6">No users found</td></tr>';

            this.showToast('Users loaded successfully', 'success');
        } catch (error) {
            console.error('Error loading users:', error);
            this.showToast('Failed to load users', 'error');
        }
    }

    filterUsers(searchTerm) {
        const roleFilter = document.getElementById('roleFilter')?.value || '';
        const query = (searchTerm || '').toLowerCase();
        const rows = document.querySelectorAll('#usersTableBody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const rowRole = row.querySelector('.role-badge')?.textContent?.toLowerCase() || '';
            const matchesQuery = !query || text.includes(query);
            const matchesRole = !roleFilter || rowRole === roleFilter.toLowerCase();
            row.style.display = matchesQuery && matchesRole ? '' : 'none';
        });
    }

    editUser(userId) {
        this.showToast('User editing coming soon', 'info');
    }

    async deleteUser(userId) {
        if (!confirm('Remove this user?')) return;

        try {
            await this.apiCall(`/users/${userId}`, 'DELETE');
            this.showToast('User removed successfully', 'success');
            this.loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            this.showToast('Failed to remove user', 'error');
        }
    }

    // ===== SETTINGS =====
    async loadSettings() {
        try {
            const response = await this.apiCall('/settings');
            const settings = response.data || {};

            document.getElementById('appName').value = settings.appName || 'GIBIConnect';
            document.getElementById('environment').value = settings.environment || 'development';
            document.getElementById('enableMFA').checked = settings.enableMFA === 'true' || settings.enableMFA === true;
            document.getElementById('enableAudit').checked = settings.enableAudit === 'true' || settings.enableAudit === true;
        } catch (error) {
            console.warn('Could not load settings:', error);
        }
    }

    async saveSettings() {
        const settings = {
            appName: document.getElementById('appName').value,
            environment: document.getElementById('environment').value,
            enableMFA: document.getElementById('enableMFA').checked,
            enableAudit: document.getElementById('enableAudit').checked
        };

        try {
            await this.apiCall('/settings', 'PUT', settings);
            this.showToast('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showToast('Failed to save settings', 'error');
        }
    }

    resetSettings() {
        if (confirm('Reset settings to default? This cannot be undone.')) {
            document.getElementById('appName').value = 'GIBIConnect';
            document.getElementById('environment').value = 'development';
            document.getElementById('enableMFA').checked = false;
            document.getElementById('enableAudit').checked = true;
            this.showToast('Settings reset to defaults', 'success');
        }
    }

    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        this.refreshTimer = setInterval(() => {
            this.loadDashboardStats();
            this.loadActivityLog();
            if (document.getElementById('fileTableBody')) {
                this.loadFiles();
            }
            if (document.getElementById('usersTableBody')) {
                this.loadUsers();
            }
        }, 30000);
    }

    // ===== UTILITY METHODS =====
    async apiCall(endpoint, method = 'GET', data = null) {
        const url = this.apiBaseUrl + endpoint;
        const options = {
            method,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            if (response.status === 401) {
                this.logout();
            }
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.style.display = 'block';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    truncateString(str, length) {
        return str.length > length ? str.substring(0, length) + '...' : str;
    }

    logout() {
        if (confirm('Logout?')) {
            localStorage.removeItem('gibi_token');
            localStorage.removeItem('gibi_user');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        }
    }
}

// Initialize dashboard
let admin;
document.addEventListener('DOMContentLoaded', () => {
    admin = new AdminDashboard();
});
