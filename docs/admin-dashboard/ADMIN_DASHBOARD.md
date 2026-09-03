# GIBIConnect Admin Dashboard

A comprehensive, independent admin panel for managing GIBIConnect content, users, and database operations. The admin dashboard is completely self-contained and does not modify existing project code.

## 📋 Table of Contents

- [Features](#features)
- [Access & Authentication](#access--authentication)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Security](#security)

---

## Features

### 📊 Dashboard

- Real-time system statistics (total files, users, database size)
- Activity log with recent admin actions
- System health monitoring

### 📁 File Manager

- Upload files (drag & drop or click to select)
- Edit file contents (for text files)
- Delete files
- Search and filter files
- File preview and metadata
- Support for multiple file uploads

### 💾 Database Management

- View database statistics (tables, record count)
- Create backups
- Export data to JSON
- Execute SELECT queries (read-only for safety)
- Backup history

### 👥 User Management

- View all users with details
- Filter by role (user, moderator, admin)
- Edit user roles and status
- Remove users
- Search functionality

### ⚙️ Settings

- Application configuration
- Environment settings
- Security options (MFA, Audit logging)
- Save/reset to defaults

---

## Access & Authentication

### Prerequisites

- User account with `admin` or `moderator` role
- Valid JWT authentication token
- CORS configured to allow admin dashboard domain

### Login

1. Log in through the main application
2. Navigate to `/admin-dashboard`
3. Credentials are validated using existing JWT tokens

### Role-Based Access

- **Admin**: Full access to all features
- **Moderator**: Limited access (files, activity log)
- **User**: No access (redirected to login)

---

## Installation

### 1. Database Schema

Apply the migration to create required tables:

```bash
psql -U postgres -d gibiconnect -f database/migrations/006_admin_dashboard_tables.sql
```

### 2. Start Backend

The admin routes are automatically registered when the backend starts:

```bash
cd backend
npm start
```

### 3. Access Admin Dashboard

Open your browser and navigate to:

```
http://localhost:5000/admin-dashboard
```

---

## Usage

### File Management

#### Upload Files

1. Go to **File Manager** section
2. Click **⬆️ Upload File** button
3. Drag files or click to select
4. Monitor upload progress
5. Refresh to see new files in list

#### Edit File

1. Find file in the list
2. Click **✎ Edit** button
3. Modify content in the modal
4. Click **Save**

#### Delete File

1. Find file in the list
2. Click **✕ Delete** button
3. Confirm deletion

### Database Operations

#### Create Backup

1. Go to **Database** section
2. Click **💾 Create Backup** button
3. Backup is recorded with timestamp

#### Export Data

1. Click **📤 Export Data**
2. JSON file downloads automatically

#### Execute Query

1. Enter a SELECT query in the text area
2. Click **Execute**
3. View results in the result panel

**⚠️ Security Note**: Only SELECT queries are allowed for safety.

### User Management

#### View Users

1. Go to **User Management** section
2. All users are listed with their details

#### Search Users

1. Use the search box to filter by name/email
2. Filter by role using the dropdown

#### Edit User

1. Click **✎ Edit** on a user row
2. Change role or status
3. Save changes

#### Remove User

1. Click **✕ Remove** on a user row
2. Confirm deletion

---

## API Endpoints

### Base Path

```
/api/admin
```

All endpoints require authentication and admin/moderator role.

### Dashboard

```http
GET /api/admin/stats
GET /api/admin/activity?limit=20
```

### File Management

```http
GET    /api/admin/files
GET    /api/admin/files/:id
POST   /api/admin/upload (multipart/form-data)
PUT    /api/admin/files/:id
DELETE /api/admin/files/:id
```

**Upload Example:**

```bash
curl -X POST http://localhost:5000/api/admin/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@file1.txt" \
  -F "files=@file2.pdf"
```

### Database Management

```http
GET    /api/admin/database/stats
POST   /api/admin/database/backup
GET    /api/admin/database/export
POST   /api/admin/database/query
```

**Query Example:**

```bash
curl -X POST http://localhost:5000/api/admin/database/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT COUNT(*) FROM users"}'
```

### User Management

```http
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
```

### Settings

```http
GET /api/admin/settings
PUT /api/admin/settings
```

---

## Architecture

### Frontend Structure

```
frontend/
├── admin-dashboard.html      # Main dashboard HTML
├── js/
│   └── admin-dashboard.js    # Dashboard logic and API calls
└── css/
    └── admin-dashboard.css   # Styling
```

### Backend Structure

```
backend/src/
├── routes/
│   └── admin.routes.js       # Admin API routes
├── controllers/
│   └── admin.controller.js   # Request handlers and business logic
└── middleware/
    ├── auth.middleware.js    # JWT authentication
    └── role.middleware.js    # Role-based authorization
```

### Database Tables

- `admin_files` - Uploaded files metadata
- `admin_activity` - Admin action audit log
- `admin_backups` - Database backup history
- `admin_settings` - Application configuration

---

## Security

### Authentication

- JWT token-based authentication
- Tokens validated on every API request
- Session timeout after token expiration

### Authorization

- Role-based access control (RBAC)
- Admin and Moderator roles required
- User role automatically forbidden

### Data Protection

- SQL query restrictions (SELECT only)
- File upload validation
- Path traversal prevention
- CORS validation

### Audit Logging

- All admin actions logged to `admin_activity` table
- Timestamps recorded for all operations
- User identification for each action

### Best Practices

1. **Never expose sensitive data** in file uploads
2. **Review audit logs regularly** for suspicious activity
3. **Keep backups** in secure off-site storage
4. **Use strong passwords** for admin accounts
5. **Enable MFA** if available
6. **Restrict admin access** to trusted networks

---

## Troubleshooting

### "Admin routes not found"

- Ensure backend is restarted after code changes
- Check that admin.routes.js is properly registered in routes/index.js

### "File upload fails"

- Check upload directory permissions: `backend/storage/uploads/admin/`
- Verify file size doesn't exceed limits
- Ensure disk has enough free space

### "Authentication error"

- Verify JWT token is valid and not expired
- Check Authorization header format: `Bearer TOKEN`
- Re-login to get fresh token

### "Database query fails"

- Only SELECT queries are allowed
- Check SQL syntax
- Verify table/column names are correct

### "Cannot access /admin-dashboard"

- Ensure user has admin or moderator role
- Check browser console for API errors
- Verify backend is running on correct port

---

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {
    /* response data */
  },
  "meta": {
    "timestamp": "2026-08-30T10:30:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional details"
  }
}
```

---

## Environment Variables

No additional environment variables required. Uses existing GIBIConnect configuration:

- `JWT_SECRET` - For token validation
- `DB_*` - Database connection (from main app)

---

## Performance Considerations

- File list pagination: Implement for large file counts
- Activity log retention: Set auto-cleanup for old entries
- Backup storage: Monitor disk usage
- Query timeout: 30 seconds limit on SELECT queries

---

## Future Enhancements

- [ ] Advanced file search and filtering
- [ ] Role-based file permissions
- [ ] Scheduled backups
- [ ] Database query builder UI
- [ ] Admin notifications
- [ ] Bulk operations
- [ ] Two-factor authentication
- [ ] Webhook management
- [ ] API key generation
- [ ] Advanced analytics

---

## Support

For issues or questions about the admin dashboard:

1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Check backend logs for API errors

---

## License

Same as GIBIConnect project.

---

**Last Updated**: 2026-08-30
**Status**: Production Ready
**Version**: 1.0.0
