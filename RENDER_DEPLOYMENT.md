# Render Deployment Guide for BlueCart ERP

This guide will help you deploy the BlueCart ERP system to Render with a PostgreSQL database.

## Prerequisites

1. Create a [Render account](https://render.com)
2. Connect your GitHub repository to Render
3. Have your code pushed to a GitHub repository

## Step 1: Create PostgreSQL Database

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Click "New +" → "PostgreSQL"

2. **Configure Database**
   - **Name**: `bluecart-database`
   - **Database**: `bluecart_erp`
   - **User**: `bluecart_user`
   - **Region**: Choose closest to you (e.g., Oregon)
   - **Plan**: Free (for development) or Starter ($7/month)

3. **Get Connection Details**
   After creation, you'll get:
   - **Internal Database URL**: `postgresql://bluecart_user:password@dpg-xxx-a.oregon-postgres.render.com:5432/bluecart_erp`
   - **External Database URL**: `postgresql://bluecart_user:password@dpg-xxx-a.oregon-postgres.render.com:5432/bluecart_erp`

## Step 2: Deploy FastAPI Backend

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `bluecart-erp`

2. **Configure Web Service**
   - **Name**: `bluecart-backend`
   - **Region**: Same as database (Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main_postgres:app --host 0.0.0.0 --port $PORT`

3. **Environment Variables**
   Add these environment variables:
   ```
   DATABASE_URL = [Your PostgreSQL Internal Database URL from Step 1]
   ENVIRONMENT = production
   PYTHON_VERSION = 3.11
   ```

4. **Health Check**
   - **Health Check Path**: `/health`

## Step 3: Update Frontend Configuration

Update your frontend to use the deployed backend URL:

1. **Create Environment File**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=https://bluecart-backend.onrender.com
   ```

2. **Update API Client**
   The API client will automatically use the environment variable.

## Step 4: Deploy Frontend (Optional - Vercel)

If you want to deploy the frontend as well:

1. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variable: `NEXT_PUBLIC_API_URL=https://bluecart-backend.onrender.com`

## Environment Variables Reference

### Backend (Render Web Service)
```
DATABASE_URL=postgresql://user:password@host:port/database
ENVIRONMENT=production
PYTHON_VERSION=3.11
```

### Frontend (Vercel/Local)
```
NEXT_PUBLIC_API_URL=https://bluecart-backend.onrender.com
```

## Testing the Deployment

1. **Check Backend Health**
   ```
   https://bluecart-backend.onrender.com/health
   ```

2. **API Documentation**
   ```
   https://bluecart-backend.onrender.com/docs
   ```

3. **Test Shipment Creation**
   ```bash
   curl -X POST "https://bluecart-backend.onrender.com/api/shipments" \
   -H "Content-Type: application/json" \
   -d '{
     "senderName": "John Doe",
     "senderAddress": "123 Main St, City",
     "receiverName": "Jane Smith", 
     "receiverAddress": "456 Oak Ave, Town",
     "packageDetails": "Electronics",
     "weight": 2.5,
     "dimensions": {"length": 10, "width": 8, "height": 6},
     "serviceType": "standard",
     "cost": 25.99
   }'
   ```

## Database Schema

The PostgreSQL database will automatically create the following table structure:

```sql
CREATE TABLE shipments (
    id VARCHAR(50) PRIMARY KEY,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(50),
    sender_address TEXT NOT NULL,
    receiver_name VARCHAR(255) NOT NULL,
    receiver_phone VARCHAR(50),
    receiver_address TEXT NOT NULL,
    package_details TEXT NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    dimensions JSONB NOT NULL,
    service_type VARCHAR(20) NOT NULL DEFAULT 'standard',
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    pickup_date TIMESTAMP,
    estimated_delivery TIMESTAMP,
    actual_delivery TIMESTAMP,
    route VARCHAR(255),
    hub_id VARCHAR(50),
    events JSONB DEFAULT '[]',
    cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check database is running
   - Ensure IP whitelist includes Render's IPs

2. **Build Failures**
   - Check requirements.txt includes all dependencies
   - Verify Python version compatibility

3. **CORS Issues**
   - Update CORS origins in main_postgres.py
   - Add your frontend domain to allowed origins

### Logs and Monitoring

- **Backend Logs**: Available in Render dashboard under your web service
- **Database Logs**: Available in Render dashboard under your PostgreSQL service
- **Health Monitoring**: Automatic health checks on `/health` endpoint

## Scaling and Production Considerations

1. **Database Backup**: Render provides automatic backups for paid plans
2. **Environment Isolation**: Use separate databases for development/staging/production
3. **Monitoring**: Consider adding logging and monitoring services
4. **Security**: Implement authentication and rate limiting for production use

## Support

- **Render Documentation**: https://render.com/docs
- **PostgreSQL on Render**: https://render.com/docs/databases
- **FastAPI Documentation**: https://fastapi.tiangolo.com

## Next Steps

1. Create the PostgreSQL database on Render
2. Deploy the backend web service
3. Test the API endpoints
4. Update frontend configuration
5. Deploy frontend (optional)
6. Set up monitoring and logging