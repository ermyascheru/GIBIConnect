# Admin Dashboard - Developer Guide

## Extending the Admin Dashboard

This guide explains how to add new features to the admin dashboard.

---

## Architecture Overview

### Frontend Architecture

```
admin-dashboard.html
    ↓
admin-dashboard.js (AdminDashboard class)
    ├─ init()             [Initialize & validate auth]
    ├─ setupEventListeners() [Attach DOM events]
    ├─ loadDashboard()    [Load dashboard data]
    ├─ apiCall()          [Fetch wrapper with auth]
    └─ showToast()        [Notifications]

admin-dashboard.css
    ├─ Layout styles (sidebar, content, modal)
    ├─ Component styles (cards, tables, forms)
    └─ Responsive styles (mobile breakpoints)
```

### Backend Architecture

```
admin.routes.js
    ↓ (routes to)
admin.controller.js
    ├─ Dashboard methods (getDashboardStats, getActivity)
    ├─ File methods (listFiles, uploadFiles, editFile, deleteFile)
    ├─ Database methods (getDatabaseStats, createBackup, executeQuery)
    ├─ User methods (listUsers, editUser, deleteUser)
    └─ Settings methods (getSettings, updateSettings)
```

---

## Adding a New Feature

### Example: Add "System Logs" Feature

#### Step 1: Update Database Schema

Create a new migration file: `database/migrations/007_admin_logs_table.sql`

```sql
-- Create system logs table
CREATE TABLE IF NOT EXISTS admin_system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL,
    module VARCHAR(100),
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for performance
CREATE INDEX idx_admin_system_logs_timestamp ON admin_system_logs(timestamp);
CREATE INDEX idx_admin_system_logs_level ON admin_system_logs(level);
```

Apply migration:

```bash
psql -U postgres -d gibiconnect -f database/migrations/007_admin_logs_table.sql
```

#### Step 2: Add Backend Controller Method

In `backend/src/controllers/admin.controller.js`, add:

```javascript
// Get system logs
async getSystemLogs(limit = 100) {
  try {
    const logs = await db.query(
      'SELECT * FROM admin_system_logs ORDER BY timestamp DESC LIMIT $1',
      [limit]
    );
    return successResponse('Logs retrieved', logs.rows);
  } catch (error) {
    return errorResponse('Failed to retrieve logs', error.message);
  }
}

// Clear old logs
async clearOldLogs(days = 30) {
  try {
    await db.query(
      'DELETE FROM admin_system_logs WHERE timestamp < NOW() - INTERVAL $1',
      [`${days} days`]
    );
    logActivity(this.userId, `Cleared logs older than ${days} days`);
    return successResponse('Old logs cleared');
  } catch (error) {
    return errorResponse('Failed to clear logs', error.message);
  }
}
```

#### Step 3: Add API Route

In `backend/src/routes/admin.routes.js`, add:

```javascript
// Logs routes
router.get("/logs", authenticate, authorize("admin"), controller.getSystemLogs);
router.delete(
  "/logs/clear",
  authenticate,
  authorize("admin"),
  controller.clearOldLogs,
);
```

#### Step 4: Update Frontend HTML

In `frontend/admin-dashboard.html`, add a new section:

```html
<!-- Logs Section -->
<div class="section" data-section="logs">
  <div class="section-header">
    <h2>📋 System Logs</h2>
  </div>

  <div class="logs-container">
    <div class="filter-bar">
      <select id="logLevelFilter">
        <option value="">All Levels</option>
        <option value="ERROR">Error</option>
        <option value="WARNING">Warning</option>
        <option value="INFO">Info</option>
      </select>
      <button id="clearLogsBtn" class="btn btn-danger">
        🗑️ Clear Old Logs
      </button>
    </div>

    <div id="logsList" class="logs-list">
      <!-- Logs will be loaded here -->
    </div>
  </div>
</div>
```

#### Step 5: Add Frontend CSS

In `frontend/css/admin-dashboard.css`, add:

```css
.logs-list {
  max-height: 600px;
  overflow-y: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.log-item {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-item:hover {
  background-color: var(--hover-bg);
}

.log-level {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 12px;
}

.log-level.error {
  background-color: #fee2e2;
  color: #dc2626;
}
.log-level.warning {
  background-color: #fef3c7;
  color: #d97706;
}
.log-level.info {
  background-color: #dbeafe;
  color: #2563eb;
}
```

#### Step 6: Add Frontend JavaScript

In `frontend/js/admin-dashboard.js`, add:

```javascript
// In AdminDashboard class:

async loadLogs() {
  try {
    const response = await this.apiCall('/logs', 'GET');
    if (response.success) {
      this.renderLogs(response.data);
    }
  } catch (error) {
    this.showToast('Failed to load logs', 'error');
  }
}

renderLogs(logs) {
  const logsContainer = document.getElementById('logsList');
  logsContainer.innerHTML = logs.map(log => `
    <div class="log-item">
      <div>
        <span class="log-level ${log.level.toLowerCase()}">${log.level}</span>
        <span>${log.message}</span>
      </div>
      <span class="text-muted">${new Date(log.timestamp).toLocaleString()}</span>
    </div>
  `).join('');
}

async clearOldLogs() {
  if (!confirm('Clear logs older than 30 days?')) return;

  try {
    const response = await this.apiCall('/logs/clear', 'DELETE');
    if (response.success) {
      this.showToast('Logs cleared successfully', 'success');
      this.loadLogs();
    }
  } catch (error) {
    this.showToast('Failed to clear logs', 'error');
  }
}

// In setupEventListeners():
document.getElementById('clearLogsBtn')?.addEventListener('click', () => {
  this.clearOldLogs();
});
```

---

## Extending Existing Features

### Add File Preview

Modify `backend/src/controllers/admin.controller.js`:

```javascript
async getFilePreview(fileId) {
  try {
    const file = await db.query(
      'SELECT * FROM admin_files WHERE id = $1',
      [fileId]
    );

    if (file.rows.length === 0) {
      return errorResponse('File not found');
    }

    const filePath = file.rows[0].file_path;
    const content = await fs.promises.readFile(filePath, 'utf-8');

    return successResponse('Preview retrieved', {
      content: content.substring(0, 10000), // First 10KB
      size: content.length,
      truncated: content.length > 10000
    });
  } catch (error) {
    return errorResponse('Cannot preview this file', error.message);
  }
}
```

### Add User Activity Filter

Modify filter in `admin.controller.js`:

```javascript
async getActivity(userId = null, limit = 20) {
  try {
    let query = 'SELECT * FROM admin_activity';
    let params = [];

    if (userId) {
      query += ' WHERE user_id = $1';
      params.push(userId);
      query += ` ORDER BY timestamp DESC LIMIT $${params.length + 1}`;
      params.push(limit);
    } else {
      query += ` ORDER BY timestamp DESC LIMIT $1`;
      params.push(limit);
    }

    const result = await db.query(query, params);
    return successResponse('Activity retrieved', result.rows);
  } catch (error) {
    return errorResponse('Failed to retrieve activity', error.message);
  }
}
```

---

## Common Patterns

### Pattern 1: Add a New API Endpoint

```javascript
// 1. Add route in admin.routes.js
router.post('/reports/generate', authenticate, authorize('admin'), controller.generateReport);

// 2. Add controller method
async generateReport(reportType) {
  // Validation
  if (!['daily', 'weekly', 'monthly'].includes(reportType)) {
    return errorResponse('Invalid report type');
  }

  // Business logic
  const data = await this.fetchReportData(reportType);

  // Logging
  logActivity(this.userId, `Generated ${reportType} report`);

  // Response
  return successResponse('Report generated', data);
}

// 3. Call from frontend
const response = await this.apiCall('/reports/generate', 'POST', {
  reportType: 'monthly'
});
```

### Pattern 2: Add Modal Dialog

```javascript
// In HTML:
<div id="reportModal" class="modal">
  <div class="modal-content">
    <h3>Generate Report</h3>
    <select id="reportType">
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
    </select>
    <button onclick="dashboard.generateReport()">Generate</button>
  </div>
</div>

// In JavaScript:
async generateReport() {
  const type = document.getElementById('reportType').value;
  const response = await this.apiCall('/reports/generate', 'POST', { reportType: type });

  if (response.success) {
    this.showToast('Report generated', 'success');
    this.closeModal('reportModal');
  }
}
```

### Pattern 3: Add Table Column

```javascript
// In renderTable method:
const html = records
  .map(
    (record) => `
  <tr>
    <td>${record.name}</td>
    <td>${record.email}</td>
    <td><span class="badge badge-${record.status}">${record.status}</span></td>
    <td>
      <button onclick="dashboard.editRecord('${record.id}')">Edit</button>
      <button onclick="dashboard.deleteRecord('${record.id}')">Delete</button>
    </td>
  </tr>
`,
  )
  .join("");
```

---

## Testing Features

### Manual Testing Checklist

```
✓ Feature loads without errors
✓ API endpoints return correct response format
✓ Database queries execute correctly
✓ Error handling works (try with invalid data)
✓ Activity is logged
✓ UI updates properly
✓ Mobile responsive
```

### Test API Endpoint

```bash
# Test file upload
curl -X POST http://localhost:5000/api/admin/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@test.txt"

# Test query
curl -X POST http://localhost:5000/api/admin/database/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT COUNT(*) FROM users"}'
```

---

## Performance Tips

1. **Use pagination** for large datasets

   ```javascript
   const page = req.query.page || 1;
   const limit = 50;
   const offset = (page - 1) * limit;
   ```

2. **Add database indexes** for frequently queried columns

   ```sql
   CREATE INDEX idx_column_name ON table_name(column_name);
   ```

3. **Cache frequently accessed data**

   ```javascript
   const cache = new Map();
   const getCached = (key, fetchFn, ttl = 3600) => {
     if (cache.has(key)) return cache.get(key);
     const data = fetchFn();
     cache.set(key, data);
     setTimeout(() => cache.delete(key), ttl * 1000);
     return data;
   };
   ```

4. **Use async/await properly**

   ```javascript
   // Don't: Fires requests in sequence
   const users = await getUsers();
   const posts = await getPosts();

   // Do: Parallel execution
   const [users, posts] = await Promise.all([getUsers(), getPosts()]);
   ```

---

## Security Best Practices

1. **Always validate input**

   ```javascript
   if (!fileId || typeof fileId !== "string") {
     return errorResponse("Invalid file ID");
   }
   ```

2. **Use parameterized queries**

   ```javascript
   // Don't: SQL injection risk
   db.query(`SELECT * FROM users WHERE id = ${id}`);

   // Do: Safe
   db.query("SELECT * FROM users WHERE id = $1", [id]);
   ```

3. **Check authorization**

   ```javascript
   if (user.role !== "admin") {
     return errorResponse("Unauthorized", "Access denied", 403);
   }
   ```

4. **Log sensitive actions**
   ```javascript
   logActivity(userId, `Deleted user: ${targetUserId}`);
   ```

---

## Code Style Guide

Follow existing project conventions:

```javascript
// Controllers: Snake_case for database columns
const { user_id, created_at } = result.rows[0];

// Routes: Kebab-case for endpoints
router.get('/admin-files', ...)

// Classes: PascalCase
class AdminDashboard { }

// Methods: camelCase
async getUserById(userId) { }

// Constants: UPPER_SNAKE_CASE
const UPLOAD_DIR = path.join(__dirname, '../../storage/uploads/admin');

// Use async/await consistently
async handler(req, res) {
  try {
    const data = await db.query(...);
    res.json(successResponse('Success', data));
  } catch (error) {
    res.status(500).json(errorResponse('Error', error.message));
  }
}
```

---

## Debugging Tips

### Check Backend Logs

```bash
cd backend
npm start
# Look for error messages
```

### Check Browser Console

```javascript
// F12 to open DevTools → Console tab
// Check for JavaScript errors
```

### Test Database Directly

```bash
psql -U postgres -d gibiconnect -c "SELECT * FROM admin_activity LIMIT 5;"
```

### Debug API Calls

```javascript
// Add logging in apiCall method
async apiCall(endpoint, method, data) {
  console.log(`${method} ${endpoint}`, data);
  const response = await fetch(...);
  console.log('Response:', response);
  return response.json();
}
```

---

## Deployment Checklist

Before deploying new features:

- [ ] Code follows project conventions
- [ ] Database migrations tested locally
- [ ] API endpoints tested with curl
- [ ] Frontend UI tested in all browsers
- [ ] Error handling implemented
- [ ] Activity logging added
- [ ] Security validated
- [ ] Documentation updated
- [ ] Tested in production-like environment

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Authentication](https://jwt.io/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Developer Guide Version**: 1.0.0
**Last Updated**: 2026-08-30
