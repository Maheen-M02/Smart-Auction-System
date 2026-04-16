# 📦 Mock Database Information

## Overview
The system now uses an **in-memory mock database** instead of MongoDB. This means:
- ✅ No MongoDB installation required
- ✅ No external dependencies
- ✅ Works immediately out of the box
- ✅ Perfect for development and testing
- ⚠️ Data is lost when server restarts

## How It Works

### In-Memory Storage
All user data is stored in a JavaScript array in memory:
```javascript
let users = [];
```

### Available Operations
- `create(userData)` - Add new user
- `findOne(query)` - Find user by email/phone/id
- `findById(id)` - Find user by ID
- `update(id, updates)` - Update user data
- `findAll()` - Get all users
- `delete(id)` - Delete user
- `clear()` - Clear all data

## Features

### ✅ Full Functionality
- User registration with KYC
- Face matching verification
- OCR text extraction
- User login
- Profile management
- All API endpoints work

### ✅ User Types Supported
- Bidders
- Auction Listers

### ✅ Data Persistence (During Runtime)
- Data persists while server is running
- Multiple users can register
- Login works for existing users
- All CRUD operations supported

## Limitations

### ⚠️ Data Loss on Restart
When you restart the backend server, all data is cleared:
```bash
# Stop server (Ctrl+C)
# Start server again
npm start

# All previous users are gone
```

### ⚠️ No Data Backup
- Data is not saved to disk
- No automatic backups
- Cannot export/import data

### ⚠️ Single Instance Only
- Data is not shared between multiple server instances
- Each server process has its own data

## Testing the Mock Database

### 1. Register a User
```bash
# Go to http://localhost:3000/register
# Complete registration
# User is stored in memory
```

### 2. View All Users
```bash
curl http://localhost:5000/api/auth/users
```

Response:
```json
{
  "count": 1,
  "users": [
    {
      "userId": "user_1",
      "name": "John Doe",
      "email": "john@example.com",
      "userType": "bidder",
      "isVerified": true
    }
  ]
}
```

### 3. Login with Existing User
```bash
# Go to http://localhost:3000/login
# Enter email: john@example.com
# Login successful!
```

### 4. Restart Server
```bash
# Stop server (Ctrl+C)
npm start

# Try to login again
# User not found - data was cleared
```

## Viewing Data

### API Endpoint
```bash
GET http://localhost:5000/api/auth/users
```

Returns all registered users with basic info.

### Console Logs
The backend logs all operations:
```
✅ User registered: john@example.com - Type: bidder
✅ User logged in: john@example.com
```

## Upgrading to Real Database

If you want persistent data, you can:

### Option 1: MongoDB (Recommended)
See `MONGODB_SETUP.md` for instructions

### Option 2: PostgreSQL
Requires additional setup

### Option 3: File-Based Storage
Simple but not recommended for production

## Current Status

✅ **Backend:** Running on port 5000  
✅ **Frontend:** Running on port 3000  
✅ **Mock DB:** Initialized and ready  
✅ **All APIs:** Working  
✅ **Registration:** Functional  
✅ **Login:** Functional  
✅ **Face Matching:** Functional  
✅ **OCR:** Functional  

## Advantages of Mock DB

### For Development
- Fast setup (no installation)
- Easy testing
- No configuration needed
- Clean slate on restart

### For Demos
- Quick demonstrations
- No database management
- Focus on features
- Easy to reset

### For Learning
- Understand data flow
- See how APIs work
- Test different scenarios
- No database complexity

## Example Usage

### Register Multiple Users

**User 1 - Bidder:**
- Name: Alice Smith
- Email: alice@example.com
- Type: Bidder

**User 2 - Auction Lister:**
- Name: Bob's Auctions
- Email: bob@example.com
- Type: Auction Lister

Both stored in memory, can login, full functionality!

### Test Scenarios

1. **Register → Login → Dashboard**
   - Register new user
   - Complete KYC
   - Login with email
   - Access dashboard

2. **Multiple Users**
   - Register 5 different users
   - All stored in memory
   - Each can login independently

3. **User Types**
   - Register bidders
   - Register auction listers
   - Different profiles for each

## Data Structure

Each user in memory looks like:
```javascript
{
  _id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  userType: "bidder",
  isVerified: true,
  kycCompleted: true,
  kycData: {
    extractedName: "JOHN DOE",
    idNumber: "ABCDE1234F",
    faceMatchScore: 0.87,
    verificationStatus: "verified",
    idImagePath: "uploads/...",
    selfieImagePath: "uploads/..."
  },
  bidderProfile: {
    address: "",
    city: "",
    state: "",
    zipCode: "",
    preferredCategories: []
  },
  createdAt: "2024-04-11T..."
}
```

## Migration Path

When ready for production:

1. Install MongoDB
2. Update `backend/routes/auth.js`
3. Replace `mockDB` with `User` model
4. Update `backend/server.js`
5. Add MongoDB connection
6. Restart server

All API endpoints remain the same!

## Summary

✅ **No MongoDB needed**  
✅ **Works immediately**  
✅ **Full functionality**  
✅ **Perfect for development**  
✅ **Easy to test**  
⚠️ **Data lost on restart**  
⚠️ **Not for production**  

Your KYC system is now fully functional without any external database! 🎉
