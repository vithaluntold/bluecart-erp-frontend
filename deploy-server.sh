#!/bin/bash

# BlueCart ERP - Server Deployment Script
# Run this script on your Ubuntu/Debian server

set -e

echo "🚀 BlueCart ERP Server Deployment Script"
echo "========================================"

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
echo "🔧 Installing required packages..."
sudo apt install -y python3 python3-pip python3-venv postgresql postgresql-contrib nginx git curl

# Create bluecart user if it doesn't exist
if ! id "bluecart" &>/dev/null; then
    echo "👤 Creating bluecart user..."
    sudo useradd -m -s /bin/bash bluecart
    sudo usermod -aG sudo bluecart
    echo "✅ User 'bluecart' created"
else
    echo "✅ User 'bluecart' already exists"
fi

# Setup PostgreSQL
echo "🗄️ Setting up PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user (interactive)
echo "📊 Setting up database..."
echo "Please enter a password for the bluecart_user database user:"
read -s DB_PASSWORD

sudo -u postgres createdb bluecart_erp 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER bluecart_user WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bluecart_erp TO bluecart_user;"
sudo -u postgres psql -c "ALTER DATABASE bluecart_erp OWNER TO bluecart_user;"

# Clone repository
echo "📥 Cloning repository..."
sudo mkdir -p /opt
cd /opt

if [ -d "/opt/bluecart-erp" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd /opt/bluecart-erp
    sudo git pull origin main
else
    echo "Cloning repository..."
    sudo git clone https://github.com/vithaluntold/bluecart-erp.git
fi

sudo chown -R bluecart:bluecart /opt/bluecart-erp
cd /opt/bluecart-erp

# Setup Python virtual environment
echo "🐍 Setting up Python environment..."
sudo -u bluecart python3 -m venv venv
sudo -u bluecart /opt/bluecart-erp/venv/bin/pip install --upgrade pip
sudo -u bluecart /opt/bluecart-erp/venv/bin/pip install -r requirements.txt

# Create environment file
echo "⚙️ Creating environment configuration..."
DATABASE_URL="postgresql://bluecart_user:$DB_PASSWORD@localhost:5432/bluecart_erp"

# Update systemd service file with correct DATABASE_URL
sudo cp /opt/bluecart-erp/bluecart-api.service /etc/systemd/system/
sudo sed -i "s|Environment=DATABASE_URL=.*|Environment=DATABASE_URL=$DATABASE_URL|" /etc/systemd/system/bluecart-api.service

# Enable and start the service
echo "🎯 Setting up systemd service..."
sudo systemctl daemon-reload
sudo systemctl enable bluecart-api
sudo systemctl start bluecart-api

# Check service status
sleep 3
if sudo systemctl is-active --quiet bluecart-api; then
    echo "✅ BlueCart API service is running"
else
    echo "❌ Failed to start BlueCart API service"
    echo "Checking logs:"
    sudo journalctl -u bluecart-api --no-pager -n 20
    exit 1
fi

# Setup Nginx
echo "🌐 Setting up Nginx..."
sudo cp /opt/bluecart-erp/nginx.conf /etc/nginx/sites-available/bluecart
sudo ln -sf /etc/nginx/sites-available/bluecart /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if sudo nginx -t; then
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    echo "✅ Nginx configured and restarted"
else
    echo "❌ Nginx configuration error"
    exit 1
fi

# Setup firewall
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 8000  # Direct API access

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "===================================="
echo ""
echo "🌐 Your BlueCart ERP API is now running at:"
echo "   http://$SERVER_IP (via Nginx)"
echo "   http://$SERVER_IP:8000 (direct access)"
echo ""
echo "🧪 Test your deployment:"
echo "   curl http://$SERVER_IP/health"
echo "   curl http://$SERVER_IP/api/shipments"
echo ""
echo "📊 Service management commands:"
echo "   sudo systemctl status bluecart-api"
echo "   sudo systemctl restart bluecart-api"
echo "   sudo journalctl -u bluecart-api -f"
echo ""
echo "🔐 Database connection string:"
echo "   $DATABASE_URL"
echo ""
echo "📝 Next steps:"
echo "   1. Test the API endpoints"
echo "   2. Configure your domain name with your DNS provider"
echo "   3. Set up SSL certificate with Let's Encrypt (optional)"
echo "   4. Configure monitoring and backups"
echo ""
echo "🆘 If you encounter issues:"
echo "   1. Check service logs: sudo journalctl -u bluecart-api -f"
echo "   2. Check Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "   3. Verify database connection: sudo -u postgres psql -d bluecart_erp -c 'SELECT 1;'"
echo ""
echo "✅ Deployment completed successfully!"