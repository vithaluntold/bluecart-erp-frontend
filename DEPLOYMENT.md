# BlueCart ERP Deployment Guide

## 🚀 **Quick Deploy Options**

### **1. Render (Recommended - Easiest)**

1. Fork this repository to your GitHub account
2. Go to [Render.com](https://render.com) and connect your GitHub
3. Create a new Web Service:
   - **Repository**: Select your forked bluecart-erp repo
   - **Branch**: main
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main_postgres.py`
4. Add Environment Variables:
   - `DATABASE_URL`: `postgresql://bluecart_database_user:k4d6Bn9Q2Jo0uJ2UbMkBVJwdzGzqZ8YA@dpg-d3id75ripnbc73e3adfg-a/bluecart_database`
   - `PORT`: 8000 (Render will override this automatically)
5. Deploy!

### **2. Railway**

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub account
3. Click "Deploy from GitHub repo"
4. Select your bluecart-erp repository
5. Railway will auto-detect Python and deploy
6. Add your DATABASE_URL environment variable
7. Deploy!

### **3. Heroku**

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:essential-0`
5. Push: `git push heroku main`

### **4. Docker Deployment**

**Local Docker:**
```bash
# Build and run
docker build -t bluecart-erp .
docker run -p 8000:8000 -e DATABASE_URL="your_db_url" bluecart-erp
```

**Docker Compose (with PostgreSQL):**
```bash
# Update DATABASE_URL in docker-compose.yml
docker-compose up -d
```

### **5. VPS/Server Deployment**

**Ubuntu/Debian Server:**

1. **Setup Server:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python, PostgreSQL, Nginx
sudo apt install python3 python3-pip python3-venv postgresql postgresql-contrib nginx -y

# Create user
sudo useradd -m -s /bin/bash bluecart
sudo usermod -aG sudo bluecart
```

2. **Setup Application:**
```bash
# Switch to bluecart user
sudo su - bluecart

# Clone repository
cd /opt
sudo git clone https://github.com/your-username/bluecart-erp.git
sudo chown -R bluecart:bluecart /opt/bluecart-erp
cd /opt/bluecart-erp

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

3. **Setup PostgreSQL:**
```bash
# Switch to postgres user
sudo su - postgres

# Create database and user
createdb bluecart_erp
createuser -P bluecart_user  # Enter password when prompted

# Grant permissions
psql -c "GRANT ALL PRIVILEGES ON DATABASE bluecart_erp TO bluecart_user;"
```

4. **Setup Systemd Service:**
```bash
# Copy service file
sudo cp /opt/bluecart-erp/bluecart-api.service /etc/systemd/system/

# Update DATABASE_URL in service file
sudo nano /etc/systemd/system/bluecart-api.service

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable bluecart-api
sudo systemctl start bluecart-api

# Check status
sudo systemctl status bluecart-api
```

5. **Setup Nginx:**
```bash
# Copy nginx config
sudo cp /opt/bluecart-erp/nginx.conf /etc/nginx/sites-available/bluecart
sudo ln -s /etc/nginx/sites-available/bluecart /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart nginx
sudo nginx -t
sudo systemctl restart nginx
```

## 🧪 **Test Endpoints**
- **Health Check**: `GET /health`
- **API Root**: `GET /`
- **Shipments**: `GET /api/shipments`
- **Hubs**: `GET /api/hubs`

## 📦 **Package Versions (Python 3.13 Compatible)**
- pg8000: 1.30.2 (Pure Python, no compilation needed)
- Built-in HTTP server (No external dependencies)
- Python: 3.13+ fully supported

## ✅ **Why This Will Work**
1. **Zero external dependencies** - Only pg8000 required
2. **Pure Python solution** - No compilation issues
3. **Python 3.13 compatible** - Latest version supported
4. **PostgreSQL ready** - Configured for your database
5. **Auto table creation** - Creates tables on startup