# 🆕 New Registration & Login Flow

## Overview
Updated system with ID + Selfie upload, face matching, and user type selection (Bidder/Auction Lister).

## User Types

### 1. Bidder 🙋
- Participates in auctions
- Places bids on items
- Profile fields: address, city, state, zipCode, preferredCategories

### 2. Auction Lister 🏪
- Creates and manages auctions
- Lists items for sale
- Profile fields: businessName, businessAddress, businessLicense, taxId

## Registration Flow

### Step 1: Select User Type
- User chooses: Bidder or Auction Lister
- Visual cards with icons

### Step 2: Upload Documents & Info
- Enter: Name, Email, Phone
- Upload Government ID image
- Upload Selfie photo
- Preview both images

### Step 3: Face Matching (Automatic)
- Backend extracts text from ID using OCR
- Frontend performs face matching using face-api.js
- Calculates similarity score (0-1)
- Shows progress: "Verifying Your Identity..."

### Step 4: Verification Result
- ✅ Success (score >= 60%): Complete registration
- ❌ Failed (score < 60%): Try again with new photos
- Shows match score percentage
- Displays extracted name and ID number

## API Endpoints

### POST /api/auth/register
Upload ID + Selfie images

**Request:**
```javascript
FormData {
  idImage: File,
  selfie: File,
  userType: 'bidder' | 'auctionLister',
  name: string,
  email: string,
  phone: string
}
```

**Response:**
```json
{
  "success": true,
  "tempUserId": "temp_1234567890",
  "idImagePath": "uploads/...",
  "selfiePath": "uploads/...",
  "ocrData": {
    "extractedName": "John Doe",
    "idNumber": "ABCDE1234F"
  }
}
```

### POST /api/auth/verify-and-login
Complete registration after face match

**Request:**
```json
{
  "tempUserId": "temp_1234567890",
  "faceMatchScore": 0.87,
  "userType": "bidder",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "idImagePath": "uploads/...",
  "selfiePath": "uploads/...",
  "ocrData": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011",
  "userType": "bidder",
  "isVerified": true,
  "message": "Registration and verification successful",
  "redirectTo": "/dashboard"
}
```

### POST /api/auth/login
Login for existing users

**Request:**
```json
{
  "email": "john@example.com"
  // OR
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "507f1f77bcf86cd799439011",
  "userType": "bidder",
  "isVerified": true,
  "kycCompleted": true,
  "name": "John Doe",
  "redirectTo": "/dashboard"
}
```

## Database Schema

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  userType: 'bidder' | 'auctionLister',
  isVerified: Boolean,
  kycCompleted: Boolean,
  kycData: {
    extractedName: String,
    idNumber: String,
    faceMatchScore: Number,
    kycHash: String,
    blockchainTxHash: String,
    verificationStatus: 'pending' | 'verified' | 'failed',
    idImagePath: String,
    selfieImagePath: String
  },
  bidderProfile: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    preferredCategories: [String]
  },
  listerProfile: {
    businessName: String,
    businessAddress: String,
    businessLicense: String,
    taxId: String
  },
  createdAt: Date
}
```

## Frontend Routes

- `/register` - New user registration with KYC
- `/login` - Existing user login (SimpleLogin component)
- `/dashboard` - User dashboard (after verification)

## Face Matching Logic

```javascript
// Load models
await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

// Detect faces
const detection1 = await faceapi
  .detectSingleFace(idImage)
  .withFaceLandmarks()
  .withFaceDescriptor();

const detection2 = await faceapi
  .detectSingleFace(selfieImage)
  .withFaceLandmarks()
  .withFaceDescriptor();

// Calculate similarity
const distance = faceapi.euclideanDistance(
  detection1.descriptor,
  detection2.descriptor
);
const similarity = 1 - distance; // 0-1 scale

// Threshold: 0.6 (60%) for verification
```

## Usage in Auction System

### Check if user can bid:
```javascript
const user = await User.findById(userId);

if (user.userType === 'bidder' && user.isVerified) {
  // Allow bidding
} else if (user.userType === 'auctionLister' && user.isVerified) {
  // Allow creating auctions
}
```

### Get user profile:
```javascript
const response = await axios.get(`/api/auth/user/${userId}`);
const { userType, isVerified, bidderProfile, listerProfile } = response.data;
```

## Testing

### Test Registration:
1. Go to http://localhost:3000/register
2. Select "Bidder" or "Auction Lister"
3. Fill in: Name, Email, Phone
4. Upload clear ID image
5. Upload clear selfie
6. Wait for face matching
7. See verification result
8. Complete registration

### Test Login:
1. Go to http://localhost:3000/login
2. Enter email or phone
3. Login redirects to dashboard

## Security Features

✅ Face matching threshold (60%)
✅ OCR text extraction from ID
✅ Hashed data on blockchain (optional)
✅ Local image storage
✅ User type validation
✅ Verification status tracking

## Next Steps

1. Add profile editing for bidders/listers
2. Integrate with auction listing/bidding system
3. Add email/SMS verification
4. Implement session management
5. Add password option (optional)

## Files Created/Updated

**Backend:**
- `backend/routes/auth.js` - New registration & login endpoints
- `backend/models/User.js` - Updated schema with userType

**Frontend:**
- `frontend/src/pages/Register.jsx` - New registration flow
- `frontend/src/pages/SimpleLogin.jsx` - Simple login page
- `frontend/src/App.jsx` - Added /register route

## Current Status

✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ New registration flow implemented
✅ Face matching integrated
✅ User types (Bidder/Lister) supported
✅ OCR text extraction working
⚠️ MongoDB not running (will need to start for data persistence)

## Start MongoDB

```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

Once MongoDB is running, the system will save user data and work fully!
