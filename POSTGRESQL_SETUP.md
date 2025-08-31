# PostgreSQL Setup Guide for Resume Doctor AI

## 🐘 PostgreSQL Installation & Configuration

### Step 1: Install PostgreSQL

#### Windows:
1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. **Remember the password you set for the 'postgres' user**
4. Default port: 5432 (keep this)
5. Start PostgreSQL service after installation

#### macOS:
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql

# Create postgres user if needed
createuser -s postgres
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Set password for postgres user
sudo -u postgres psql
\password postgres
\q
```

### Step 2: Verify PostgreSQL Installation
```bash
# Test connection (should prompt for password)
psql -U postgres -h localhost

# If successful, you'll see:
# postgres=#
# Type \q to quit
```

### Step 3: Configure Resume Doctor AI for PostgreSQL

#### Option A: Automatic Setup (Recommended)
```bash
# Run the setup script
python setup_postgresql.py
```

#### Option B: Manual Setup

1. **Create Database:**
```sql
-- Connect to PostgreSQL
psql -U postgres -h localhost

-- Create database
CREATE DATABASE resume_doctor;

-- Verify database was created
\l

-- Quit
\q
```

2. **Update .env file:**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/resume_doctor
SECRET_KEY=bfd5a644563e480e45e6b2c4409770b1c76c94f6e4283f57d61eb8e4e0f2e0b2
JWT_SECRET_KEY=bfd5a644563e480e45e6b2c4409770b1c76c94f6e4283f57d61eb8e4e0f2e0b2
OPENAI_API_KEY=your_openai_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

**Replace `YOUR_PASSWORD` with your actual PostgreSQL password!**

### Step 4: Start the Application
```bash
# Start the Flask application
python backend/app.py
```

You should see:
```
✅ Database tables created successfully
✅ Database connection verified
✅ Database initialized successfully
🌐 Starting Flask development server...
📍 Available at: http://localhost:5000
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. "password authentication failed for user 'postgres'"
**Solution**: Update the password in the DATABASE_URL in `.env` file
```env
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@localhost:5432/resume_doctor
```

#### 2. "connection to server at localhost, port 5432 failed"
**Solutions**:
- Ensure PostgreSQL service is running
- Check if PostgreSQL is installed
- Verify port 5432 is not blocked by firewall

#### 3. "database 'resume_doctor' does not exist"
**Solution**: Create the database manually:
```sql
psql -U postgres -h localhost
CREATE DATABASE resume_doctor;
\q
```

#### 4. Permission Issues
**Solution**: Grant proper permissions:
```sql
psql -U postgres -h localhost
GRANT ALL PRIVILEGES ON DATABASE resume_doctor TO postgres;
\q
```

## 🚀 Benefits of PostgreSQL vs SQLite

### PostgreSQL Advantages:
- **Better Performance**: Handles concurrent users better
- **Advanced Features**: Full-text search, JSON support, advanced indexing
- **Scalability**: Can handle millions of records efficiently
- **Production Ready**: Industry standard for web applications
- **ACID Compliance**: Better data integrity and consistency
- **Concurrent Access**: Multiple users can access simultaneously

### Migration Benefits:
- **No Code Changes**: Same SQLAlchemy models work with both databases
- **Better Analytics**: Advanced querying capabilities for user analytics
- **Future-Proof**: Ready for production deployment
- **Performance**: Faster complex queries and joins

## 📊 Database Schema

The PostgreSQL database will have the same schema as SQLite:

### Tables:
- **users**: User accounts with scan tracking
- **resumes**: Uploaded resume files and extracted text
- **job_descriptions**: Job postings and requirements
- **scan_history**: Analysis results and matching scores

### New Scan Tracking Fields:
- `free_scans_remaining`: Number of free scans left (default: 5)
- `total_scans_used`: Total scans performed by user
- `is_premium`: Premium subscription status

## 🔄 Switching Back to SQLite

If you need to switch back to SQLite:
```env
DATABASE_URL=sqlite:///resume_doctor.db
```

Then restart the application:
```bash
python backend/app.py
```

## ✅ Verification

After setup, verify everything works:
1. Register a new user
2. Check scan status (should show 5 free scans)
3. Upload resume and job description
4. Run analysis (should decrement scan count)
5. Check scan status again (should show 4 free scans)

---

**Note**: The application gracefully handles database failures and will continue to serve the frontend even if the database connection fails, but API functionality will be limited.
