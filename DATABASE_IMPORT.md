# 📊 Database Import Quick Reference

## 🚀 Quick Import (3 Steps)

```bash
# 1. Set up database
cd back
python manage.py migrate

# 2. Import data
python migrate_data.py

# 3. Verify import
python manage.py shell
```

```python
# In Django shell, verify data:
from organizations.models import Organization, Project, Task, TaskComment
print(f"Organizations: {Organization.objects.count()}")
print(f"Projects: {Project.objects.count()}")
print(f"Tasks: {Task.objects.count()}")
print(f"Comments: {TaskComment.objects.count()}")
```

## 📁 What's Included

The `back/data_backup.json` file contains:

- ✅ **1 Organization**: "Demo Organization" (demo-org)
- ✅ **5 Projects**: Sample projects with different statuses
- ✅ **15+ Tasks**: Various tasks with priorities and assignees  
- ✅ **Comments**: Sample comments on tasks
- ✅ **Users**: Demo user accounts

## 🔧 Manual Import

If the script doesn't work:

```bash
cd back
python manage.py loaddata data_backup.json
```

## 🌐 For Production

When deploying to Railway/Render/Heroku:

1. **Deploy your app**
2. **SSH into the server:**
   ```bash
   railway connect  # or heroku run bash
   ```
3. **Run migrations:**
   ```bash
   python manage.py migrate
   ```
4. **Import data:**
   ```bash
   python migrate_data.py
   ```

## 🆘 Troubleshooting

### "No module named 'backend'"
- Make sure you're in the `back` directory
- Run: `python3 manage.py shell` then paste the import code

### "Database connection failed"
- Check your `.env` file
- Ensure PostgreSQL is running
- Verify database credentials

### "Permission denied"
- Check file permissions: `chmod +x migrate_data.py`
- Run with proper user permissions

## 📊 Data Verification

After import, you should see:
- **Organizations**: 1
- **Projects**: 5
- **Tasks**: 15+
- **Comments**: 10+

Login with any email to access the demo organization!
