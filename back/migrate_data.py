#!/usr/bin/env python3
"""
Script to migrate data from local database to production database.
Run this after setting up your production database.
"""

import os
import django
import environ

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management import call_command
from organizations.models import Organization, Project, Task, TaskComment

def migrate_data():
    """Migrate data from backup to production database."""
    print("🔄 Starting data migration...")
    
    try:
        # Load data from backup
        call_command('loaddata', 'data_backup.json')
        print("✅ Data migration completed successfully!")
        
        # Print summary
        print(f"📊 Migration Summary:")
        print(f"   - Organizations: {Organization.objects.count()}")
        print(f"   - Projects: {Project.objects.count()}")
        print(f"   - Tasks: {Task.objects.count()}")
        print(f"   - Comments: {TaskComment.objects.count()}")
        
    except Exception as e:
        print(f"❌ Error during migration: {e}")
        print("💡 Make sure your production database is set up correctly.")

if __name__ == '__main__':
    migrate_data()
