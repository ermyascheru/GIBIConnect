# Admin Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Apply Database Migration (1 min)

```bash
cd /path/to/GIBIConnect
psql -U postgres -d gibiconnect -f database/migrations/006_admin_dashboard_tables.sql
```

**Expected Output:**

```
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE INDEX
...
INSERT 0 4
```

### Step 2: Start Backend (if not already running)

```bash
cd backend
npm start
```

**Expected Output:**

```
Server running on port 5000
Database connected
Admin routes registered at /api/admin
```

### Step 3: Login to Main App

1. Open http://localhost:5000/
2. Login with your admin/moderator account
3. Ensure your account has `admin` or `moderator` role

### Step 4: Access Admin Dashboard

Navigate to:

```
http://localhost:5000/admin-dashboard
```

### Step 5: Start Managing!

You should see:

- Dashboard with stats
- File manager
- Database management tools
- User management
- Settings

---

## 📋 Features Quick Reference

| Feature          | Access           | What You Can Do            |
| ---------------- | ---------------- | -------------------------- |
| **Dashboard**    | Everyone         | View stats, activity log   |
| **File Manager** | Admin, Moderator | Upload, edit, delete files |
| **Database**     | Admin only       | Backup, export, query      |
| **Users**        | Admin only       | View, edit, remove users   |
| **Settings**     | Admin only       | Configure app settings     |

---

## 🔒 First-Time Setup Checklist

- [ ] Database migration applied
- [ ] Backend restarted
- [ ] Logged in with admin account
- [ ] Can access /admin-dashboard
- [ ] Dashboard loads without errors
- [ ] Can see existing files/users

---

## 💡 Common Tasks

### Upload Your First File

1. Go to File Manager
2. Click **⬆️ Upload File**
3. Drag a file or click to select
4. Wait for upload to complete
5. File appears in the list

### Create a Database Backup

1. Go to Database
2. Click **💾 Create Backup**
3. Confirm when prompted
4. Backup recorded with timestamp

### Check User Activity

1. View Dashboard
2. Scroll to "Recent Activity" section
3. See latest admin actions

---

## ⚠️ Important Notes

1. **Only SELECT queries** are allowed in database query tool
2. **File uploads** are stored in `backend/storage/uploads/admin/`
3. **Activity logs** record all admin actions
4. **Backups** are recorded but need external storage
5. **Session expires** when JWT token expires (check your auth config)

---

## 🆘 Quick Troubleshooting

### Can't access admin dashboard

```
✓ Check you're logged in
✓ Check you have admin/moderator role
✓ Check backend is running on port 5000
```

### Upload fails

```
✓ Check file size
✓ Check disk space: du -sh backend/storage/uploads/
✓ Check folder permissions: chmod 755 backend/storage/uploads/admin/
```

### Database query fails

```
✓ Only SELECT queries allowed
✓ Check table names are correct
✓ Check SQL syntax
```

---

## 📞 Need Help?

1. Check `ADMIN_DASHBOARD.md` for full documentation
2. Review API endpoints in documentation
3. Check backend logs: `npm start`
4. Check browser console: F12 → Console tab

---

**Ready to go!** 🎉
