#!/bin/bash

echo "🚀 Starting deployment process..."

# Build frontend
echo "📦 Building frontend..."
cd front
npm install
npm run build
cd ..

# Prepare backend
echo "🔧 Preparing backend..."
cd back
pip install -r requirements.txt
python manage.py collectstatic --noinput
cd ..

echo "✅ Build complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Railway/Render/Heroku"
echo "3. Set up environment variables"
echo "4. Deploy!"
echo ""
echo "🌐 Your data backup is saved as: back/data_backup.json"
