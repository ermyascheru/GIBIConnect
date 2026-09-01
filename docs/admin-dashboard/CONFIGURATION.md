# Admin Dashboard - Configuration Guide

## Environment & Settings

### Application Settings

Access these via **Settings** section in admin dashboard.

#### App Name

- **Default**: `GIBIConnect`
- **Purpose**: Display name for the application
- **Update**: Change in Settings → App Name

#### Environment

- **Options**: `development`, `staging`, `production`
- **Default**: `development`
- **Purpose**: Controls logging level and error reporting
- **Update**: Select in Settings → Environment dropdown

#### Security Settings

##### Enable MFA (Multi-Factor Authentication)

- **Default**: `false`
- **Purpose**: Require second factor for admin login
- **Impact**: Increases security but requires 2FA setup
- **Update**: Toggle in Settings → Enable MFA

##### Enable Audit Logging

- **Default**: `true`
- **Purpose**: Log all admin actions to database
- **Impact**: Increases database size over time
- **Update**: Toggle in Settings → Enable Audit Logging

---

## Database Configuration

### Supported Databases

- PostgreSQL 12+
- Tested with PostgreSQL 16 and pgvector

### Required Extensions

- `uuid-ossp` (for UUID generation)
- `pgvector` (optional, for future AI features)

### Admin Tables

```sql
-- Automatically created by migration
admin_files      -- File storage metadata
admin_activity   -- Audit log
admin_backups    -- Backup history
admin_settings   -- Configuration storage
```

### Backup Configuration

#### Backup Storage Locations

```
Local: backend/storage/backups/
```

#### Backup Strategy

1. **Manual Backups** - Click "Create Backup" button
2. **Automated** - Set up cron job (recommended for production)

#### Recommended Cron Job

```bash
# Daily backup at 2 AM
0 2 * * * pg_dump -U postgres gibiconnect > /path/to/backups/backup-$(date +\%Y-\%m-\%d).sql
```

---

## File Storage Configuration

### Upload Directory

```
backend/storage/uploads/admin/
```

### Configuration Options

```javascript
// In admin.controller.js
UPLOAD_DIR = path.join(__dirname, "../../storage/uploads/admin");
MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB (configurable)
ALLOWED_TYPES = ["*/*"]; // Configure as needed
```

### File Permissions

```bash
# Ensure directory is writable
chmod 755 backend/storage/uploads/admin/

# Check ownership
ls -ld backend/storage/uploads/admin/
```

### Disk Space Monitoring

```bash
# Check upload directory size
du -sh backend/storage/uploads/admin/

# Clean old files
find backend/storage/uploads/admin/ -mtime +30 -delete
```

---

## Authentication & Authorization

### JWT Configuration

Admin dashboard uses the same JWT tokens as the main app.

```env
# .env file
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
```

### Role Hierarchy

```
user       → No admin access (forbidden)
moderator  → Limited access (files, activity)
admin      → Full access (all features)
```

### Session Management

- Tokens expire based on `JWT_EXPIRES_IN`
- Expired tokens automatically redirect to login
- No session cookies used (stateless)

---

## API Rate Limiting (Optional)

For production, add rate limiting to prevent abuse:

```javascript
// backend/src/middleware/rateLimit.middleware.js
const rateLimit = require("express-rate-limit");

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// In admin.routes.js
router.use(adminLimiter);
```

---

## Logging Configuration

### Activity Log

Stored in `admin_activity` table with:

- User ID
- Action description
- Timestamp

### View Activity

```bash
# SQL query to check logs
psql -U postgres -d gibiconnect -c "SELECT * FROM admin_activity LIMIT 10;"
```

### Archive Old Logs

```sql
-- Delete logs older than 90 days
DELETE FROM admin_activity WHERE timestamp < NOW() - INTERVAL '90 days';

-- Or archive to backup table
INSERT INTO admin_activity_archive
SELECT * FROM admin_activity WHERE timestamp < NOW() - INTERVAL '90 days';
```

---

## Security Best Practices

### 1. Access Control

```javascript
// Only admin/moderator can access
router.get(
  "/files",
  authenticate,
  authorize("admin", "moderator"),
  controller.listFiles,
);
```

### 2. Input Validation

- All file uploads scanned for malware (implement)
- SQL queries restricted to SELECT only
- Path traversal prevented with `path.join()`

### 3. Data Protection

- Sensitive data logged separately
- Passwords never stored in activity log
- API responses validated

### 4. CORS Configuration

```javascript
// In app.js
app.use(
  cors({
    origin: process.env.ADMIN_ALLOWED_ORIGINS || "*",
    credentials: true,
  }),
);
```

### 5. HTTPS (Production)

```nginx
# Nginx config
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

---

## Performance Optimization

### File Listing

```javascript
// Implement pagination for large datasets
const limit = 50;
const offset = (page - 1) * limit;
// SELECT * FROM admin_files LIMIT $1 OFFSET $2
```

### Database Queries

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_admin_files_uploaded_at ON admin_files(uploaded_at);
CREATE INDEX idx_admin_activity_user_id ON admin_activity(user_id);
```

### Caching

```javascript
// Cache database stats
const redis = require("redis");
const cache = redis.createClient();

// Set cache with TTL
cache.setex("db_stats", 3600, JSON.stringify(stats));
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Disk Usage** - File uploads consuming space
2. **Database Size** - Activity logs growing
3. **API Response Time** - Performance degradation
4. **Failed Auth Attempts** - Security threats

### Setup Monitoring

```bash
# Install monitoring tools
npm install pm2 pm2-monitoring

# Start with PM2
pm2 start src/server.js --name "gibiconnect-api"
pm2 monit
```

---

## Maintenance Tasks

### Daily

- Review admin activity log
- Check system health
- Monitor disk space

### Weekly

- Review file uploads
- Verify backups
- Check error logs

### Monthly

- Optimize database
- Archive old logs
- Review security settings

### Quarterly

- Update dependencies
- Security audit
- Performance review

---

## Troubleshooting Configuration Issues

### Admin routes not working

```bash
# Verify routes are registered
grep "router.use('/admin'" backend/src/routes/index.js

# Check backend logs for errors
npm start
```

### File uploads failing

```bash
# Check permissions
ls -ld backend/storage/uploads/admin/
chmod 755 backend/storage/uploads/admin/

# Check disk space
df -h /
```

### Database connection issues

```bash
# Test connection
psql -U postgres -d gibiconnect -c "SELECT 1"

# Check pg pool
# In database config, increase pool size if needed
```

### Authentication failing

```bash
# Verify JWT secret matches
grep JWT_SECRET backend/.env
grep JWT_SECRET frontend/admin-dashboard.html

# Check token expiration
# In browser console: atob(token.split('.')[1])
```

---

## Next Steps

1. ✅ Apply database migration
2. ✅ Configure environment variables
3. ✅ Test file uploads
4. ✅ Create backup
5. ✅ Review audit logs
6. ✅ Set up monitoring
7. ✅ Document changes

---

**Configuration Version**: 1.0.0
**Last Updated**: 2026-08-30
