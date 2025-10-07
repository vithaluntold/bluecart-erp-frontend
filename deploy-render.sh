#!/bin/bash

# BlueCart ERP - Render Deployment Script
# This script helps automate the deployment to Render

echo "🚀 BlueCart ERP - Render Deployment Setup"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: This script should be run from the root of the bluecart-erp project"
    exit 1
fi

echo "✅ In correct directory"

# Check if backend files exist
if [ ! -f "backend/main_postgres.py" ]; then
    echo "❌ Error: backend/main_postgres.py not found"
    exit 1
fi

if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: backend/requirements.txt not found"
    exit 1
fi

echo "✅ Backend files found"

# Commit changes to git
echo "📝 Committing changes to git..."
git add .
git commit -m "Add PostgreSQL support and Render deployment configuration"
git push origin main

echo "✅ Changes pushed to GitHub"

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 📊 CREATE POSTGRESQL DATABASE"
echo "   - Go to https://dashboard.render.com"
echo "   - Click 'New +' → 'PostgreSQL'"
echo "   - Name: bluecart-database"
echo "   - Database: bluecart_erp"
echo "   - User: bluecart_user"
echo "   - Plan: Free (for testing) or Starter"
echo "   - Region: Choose closest to you"
echo ""
echo "2. 🔗 GET DATABASE URL"
echo "   - After creation, copy the 'Internal Database URL'"
echo "   - Example: postgresql://bluecart_user:password@dpg-xxx.oregon-postgres.render.com:5432/bluecart_erp"
echo ""
echo "3. 🌐 CREATE WEB SERVICE"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect GitHub repository: bluecart-erp"
echo "   - Name: bluecart-backend"
echo "   - Root Directory: backend"
echo "   - Build Command: pip install -r requirements.txt"
echo "   - Start Command: uvicorn main_postgres:app --host 0.0.0.0 --port \\$PORT"
echo ""
echo "4. ⚙️ ENVIRONMENT VARIABLES"
echo "   Add these to your web service:"
echo "   - DATABASE_URL = [Your PostgreSQL Internal Database URL from step 2]"
echo "   - ENVIRONMENT = production"
echo "   - PYTHON_VERSION = 3.11"
echo ""
echo "5. 🏥 HEALTH CHECK"
echo "   - Health Check Path: /health"
echo ""
echo "6. 🧪 TEST DEPLOYMENT"
echo "   - Visit: https://bluecart-backend.onrender.com/health"
echo "   - API Docs: https://bluecart-backend.onrender.com/docs"
echo ""
echo "7. 🎨 UPDATE FRONTEND (Optional)"
echo "   - Add to .env.local: NEXT_PUBLIC_API_URL=https://bluecart-backend.onrender.com"
echo "   - Deploy to Vercel or continue using localhost"
echo ""
echo "📚 Full instructions: See RENDER_DEPLOYMENT.md"
echo ""
echo "🆘 Need help? Check the Render documentation:"
echo "   - https://render.com/docs"
echo "   - https://render.com/docs/databases"
echo ""

echo "✨ Setup complete! Follow the steps above to deploy to Render."