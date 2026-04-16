# 🍃 MongoDB Setup Guide

## Option 1: Local MongoDB (Recommended for Development)

### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer (.msi file)
3. Choose "Complete" installation
4. Install as a Windows Service (check the box)
5. Install MongoDB Compass (GUI tool) - check the box during installation

**Mac:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 2: Start MongoDB Server

**Windows:**
```bash
# If installed as service, it should auto-start
# To start manually:
net start MongoDB

# Or run directly:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
```

**Mac:**
```bash
brew services start mongodb-community

# Or run manually:
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod

# Check status:
sudo systemctl status mongod
```

### Step 3: Verify MongoDB is Running

```bash
# Test connection
mongosh

# You should see:
# Current Mongosh Log ID: ...
# Connecting to: mongodb://127.0.0.1:27017
# Using MongoDB: 6.0.x
```

Type `exit` to quit mongosh.

---

## Option 2: MongoDB Compass (GUI)

### Install MongoDB Compass

**If not installed during MongoDB installation:**
- Download from: https://www.mongodb.com/try/download/compass
- Install the application

### Connect to Local MongoDB

1. **Open MongoDB Compass**

2. **Connection String:**
   ```
   mongodb://localhost:27017
   ```

3. **Click "Connect"**

4. **You should see:**
   - admin
   - config
   - local
   - (Your databases will appear here)

### Create Database for KYC System

1. Click "Create Database" button
2. Database Name: `kyc-verification`
3. Collection Name: `users`
4. Click "Create Database"

### View Your Data

After registering users through the app:
1. Click on `kyc-verification` database
2. Click on `users` collection
3. You'll see all registered users with their KYC data

---

## Option 3: MongoDB Atlas (Cloud - Free Tier)

### Step 1: Create Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Choose "Shared" (Free tier)
4. Select cloud provider and region
5. Create cluster (takes 3-5 minutes)

### Step 2: Setup Database Access

1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `kycuser`
5. Password: Create a strong password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 3: Setup Network Access

1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://kycuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 5: Update Backend .env

```env
MONGODB_URI=mongodb+srv://kycuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kyc-verification?retryWrites=true&w=majority
```

### Step 6: Connect with Compass

1. Open MongoDB Compass
2. Paste your connection string
3. Click "Connect"
4. You'll see your Atlas database

---

## Configure Your KYC Backend

### Update backend/.env

**For Local MongoDB:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kyc-verification
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=deployed_contract_address_here
```

**For MongoDB Atlas:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://kycuser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kyc-verification?retryWrites=true&w=majority
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=deployed_contract_address_here
```

---

## Restart Backend

After configuring MongoDB:

```bash
cd backend
npm start
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB connected
```

---

## Troubleshooting

### Error: ECONNREFUSED 127.0.0.1:27017

**Problem:** MongoDB server is not running

**Solution:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Error: Authentication failed

**Problem:** Wrong username/password for Atlas

**Solution:**
1. Check your Atlas credentials
2. Ensure password doesn't have special characters (or URL encode them)
3. Verify user has correct permissions

### Error: IP not whitelisted

**Problem:** Your IP is not allowed in Atlas

**Solution:**
1. Go to Network Access in Atlas
2. Add your current IP or allow all (0.0.0.0/0)

### Can't connect with Compass

**Problem:** Wrong connection string

**Solution:**
- Local: `mongodb://localhost:27017`
- Atlas: Use the full connection string from Atlas dashboard
- Ensure MongoDB is running (local)

---

## Verify Connection

### Test with mongosh

```bash
mongosh "mongodb://localhost:27017/kyc-verification"

# Or for Atlas:
mongosh "mongodb+srv://kycuser:PASSWORD@cluster0.xxxxx.mongodb.net/kyc-verification"
```

### Test Backend Connection

```bash
# Start backend
cd backend
npm start

# You should see:
# ✅ MongoDB connected
```

### Test with Compass

1. Open Compass
2. Connect to your database
3. You should see `kyc-verification` database
4. After registering a user, refresh and see the `users` collection

---

## Quick Start Commands

### Start Everything

**Terminal 1: MongoDB (if local)**
```bash
mongod
# Or on Windows: net start MongoDB
```

**Terminal 2: Backend**
```bash
cd backend
npm start
```

**Terminal 3: Frontend**
```bash
cd frontend
npm run dev
```

**Browser:**
```
http://localhost:3000
```

---

## MongoDB Compass Features

### View Data
- Browse collections
- View documents
- Search and filter

### Edit Data
- Click on a document to edit
- Modify fields
- Save changes

### Query Data
```javascript
// Find verified users
{ "isVerified": true }

// Find bidders
{ "userType": "bidder" }

// Find by email
{ "email": "user@example.com" }
```

### Indexes
- Create indexes for better performance
- Recommended: Index on `email`, `phone`, `userType`

### Export/Import
- Export data to JSON/CSV
- Import data from files

---

## Database Structure

After registration, you'll see:

```javascript
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "userType": "bidder",
  "isVerified": true,
  "kycCompleted": true,
  "kycData": {
    "extractedName": "JOHN DOE",
    "idNumber": "ABCDE1234F",
    "faceMatchScore": 0.87,
    "verificationStatus": "verified",
    "idImagePath": "uploads/1234567890-id.jpg",
    "selfieImagePath": "uploads/1234567890-selfie.jpg"
  },
  "bidderProfile": {
    "address": "",
    "city": "",
    "state": "",
    "zipCode": "",
    "preferredCategories": []
  },
  "createdAt": ISODate("2024-04-11T...")
}
```

---

## Next Steps

1. ✅ Install MongoDB
2. ✅ Start MongoDB server
3. ✅ Install MongoDB Compass
4. ✅ Connect Compass to MongoDB
5. ✅ Update backend/.env
6. ✅ Restart backend
7. ✅ Test registration
8. ✅ View data in Compass

---

## Recommended: MongoDB Atlas (Cloud)

**Advantages:**
- No local installation needed
- Automatic backups
- Free tier (512MB storage)
- Accessible from anywhere
- Built-in monitoring

**Perfect for:**
- Development
- Testing
- Small production apps
- Learning

---

## Support

**MongoDB Documentation:**
- https://docs.mongodb.com/

**MongoDB Compass:**
- https://docs.mongodb.com/compass/

**MongoDB Atlas:**
- https://docs.atlas.mongodb.com/

**Community:**
- https://community.mongodb.com/
