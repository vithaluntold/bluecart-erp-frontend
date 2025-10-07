import asyncpg
import asyncio
import os

# Your Render PostgreSQL connection details
DATABASE_URL = "postgresql://bluecart_database_user:k4d6Bn9Q2Jo0uJ2UbMkBVJwdzGzqZ8YA@dpg-d3id75ripnbc73e3adfg-a.oregon-postgres.render.com/bluecart_database"

async def test_database_connection():
    """Test connection to Render PostgreSQL database"""
    print("🔗 Testing connection to Render PostgreSQL...")
    print(f"📍 Host: dpg-d3id75ripnbc73e3adfg-a.oregon-postgres.render.com")
    print(f"🗄️  Database: bluecart_database")
    print(f"👤 User: bluecart_database_user")
    
    try:
        # Connect to database
        conn = await asyncpg.connect(DATABASE_URL)
        print("✅ Successfully connected to PostgreSQL!")
        
        # Test basic query
        version = await conn.fetchval('SELECT version()')
        print(f"📊 PostgreSQL Version: {version[:50]}...")
        
        # Test table creation
        print("🔨 Creating shipments table...")
        create_table_sql = """
        CREATE TABLE IF NOT EXISTS shipments_test (
            id VARCHAR(50) PRIMARY KEY,
            tracking_number VARCHAR(50) UNIQUE NOT NULL,
            sender_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        await conn.execute(create_table_sql)
        print("✅ Table created successfully!")
        
        # Test data insertion
        print("📝 Testing data insertion...")
        insert_sql = """
        INSERT INTO shipments_test (id, tracking_number, sender_name) 
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET sender_name = EXCLUDED.sender_name
        """
        await conn.execute(insert_sql, "TEST001", "TN001", "Test Sender")
        print("✅ Data inserted successfully!")
        
        # Test data retrieval
        print("📋 Testing data retrieval...")
        result = await conn.fetchrow("SELECT * FROM shipments_test WHERE id = 'TEST001'")
        if result:
            print(f"✅ Data retrieved: {dict(result)}")
        
        # Clean up test table
        await conn.execute("DROP TABLE IF EXISTS shipments_test")
        print("🧹 Test table cleaned up")
        
        await conn.close()
        print("🎉 All database tests passed! Your PostgreSQL is ready!")
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        print("🔧 Check your connection details and try again")

if __name__ == "__main__":
    asyncio.run(test_database_connection())