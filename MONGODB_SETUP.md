# MongoDB Installation Guide

## Option 1: MongoDB Atlas (Recommended for Production)

**MongoDB Atlas is a FREE cloud-hosted MongoDB service - Perfect for deployment!**

### Steps:

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select a cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Setup Database Access**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `copticleague`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://copticleague:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://copticleague:yourpassword@cluster0.xxxxx.mongodb.net/coptic-league?retryWrites=true&w=majority`

6. **Update Your .env File**
   ```
   MONGODB_URI=mongodb+srv://copticleague:yourpassword@cluster0.xxxxx.mongodb.net/coptic-league?retryWrites=true&w=majority
   ```

---

## Option 2: Local MongoDB Installation

### Windows

1. **Download MongoDB**
   - Go to https://www.mongodb.com/try/download/community
   - Select "Windows" and download the MSI installer

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install MongoDB as a Service (check this option)
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**
   ```powershell
   # Open PowerShell and run:
   mongod --version
   ```

4. **Start MongoDB** (if not running as service)
   ```powershell
   # Create data directory
   mkdir C:\data\db

   # Start MongoDB
   mongod --dbpath C:\data\db
   ```

5. **Connection String** (for local):
   ```
   MONGODB_URI=mongodb://localhost:27017/coptic-league
   ```

### macOS

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify installation
mongod --version

# Connection string
MONGODB_URI=mongodb://localhost:27017/coptic-league
```

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public GPG Key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Create list file
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
mongod --version

# Connection string
MONGODB_URI=mongodb://localhost:27017/coptic-league
```

---

## Verify MongoDB Connection

### Test Connection with MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Enter your connection string
3. Click "Connect"
4. You should see your database

### Test Connection with Node.js

```bash
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coptic-league').then(() => console.log('✅ MongoDB Connected!')).catch(err => console.log('❌ Error:', err));"
```

---

## MongoDB Compass (GUI Tool)

MongoDB Compass is a graphical interface for MongoDB:

- **View Collections**: See all your data
- **Query Data**: Run queries without code
- **Add/Edit Documents**: Manually manage data
- **Create Indexes**: Optimize performance
- **Export Data**: Backup your database

Download: https://www.mongodb.com/try/download/compass

---

## Troubleshooting

### Connection Issues

**Error: MongoServerError: bad auth**
- Wrong username or password
- Check your connection string

**Error: connect ECONNREFUSED**
- MongoDB is not running
- Start MongoDB service

**Error: IP not whitelisted (Atlas)**
- Add your IP address in Atlas Network Access
- Or allow access from anywhere (0.0.0.0/0)

### Windows Service Issues

```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# Start service
Start-Service -Name MongoDB

# Stop service
Stop-Service -Name MongoDB
```

### Linux Service Issues

```bash
# Check status
sudo systemctl status mongod

# Start service
sudo systemctl start mongod

# Restart service
sudo systemctl restart mongod

# View logs
sudo tail -f /var/log/mongodb/mongod.log
```

---

## Best Practices

1. **Use MongoDB Atlas for Production** - Free tier is sufficient for most apps
2. **Secure Your Credentials** - Never commit .env files to git
3. **Regular Backups** - Atlas provides automatic backups
4. **Monitor Performance** - Use Atlas monitoring tools
5. **Index Important Fields** - Improves query performance

---

## Next Steps

After MongoDB is set up:

1. Update `backend/.env` with your connection string
2. Start your backend: `cd backend && npm run dev`
3. Backend will automatically connect to MongoDB
4. Your app is ready to use!

---

## For Development vs Production

**Development (Local)**:
```
MONGODB_URI=mongodb://localhost:27017/coptic-league
```

**Production (Atlas)**:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/coptic-league?retryWrites=true&w=majority
```

Both work the same way - just change the connection string!
