# KYC + Smart Auction Integration Guide

## Quick Start

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    BidBazaar Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  KYC System (Port 3000 + 5000)                              │
│  ├── Landing Page (/)                                        │
│  ├── Registration (/register) - ID + Selfie + Face Match    │
│  ├── Login (/login)                                          │
│  └── Dashboard (/dashboard) → Redirects to Auction          │
│                                                               │
│  Auction System (Port 3070 + 3090)                          │
│  ├── Marketplace Selection (/marketplace)                    │
│  ├── Role Selection (/role-selection)                        │
│  ├── Auction Dashboard (/dashboard)                          │
│  ├── Auction Details (/auction/:id)                          │
│  └── Leaderboard (/leaderboard)                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## User Flow

### 1. New User Registration
```
1. Visit http://localhost:3000 (Landing Page)
2. Click "Get Started - Register Now"
3. Fill in details:
   - Name, Email, Phone
   - User Type: Bidder or Auction Lister
   - Upload Government ID
   - Take Selfie
4. System performs:
   - OCR text extraction from ID
   - Face matching between ID and selfie
   - Verification (score > 60%)
5. User is verified and logged in
6. Redirected to KYC Dashboard
7. Click "Go to Auction Platform"
8. Redirected to Auction System (port 3070)
```

### 2. Existing User Login
```
1. Visit http://localhost:3000
2. Click "Already Verified? Login"
3. Enter email or phone
4. System checks verification status
5. If verified → Dashboard → Auction Platform
6. If not verified → Registration flow
```

### 3. Auction Platform Access
```
1. User arrives at http://localhost:3070
2. System checks localStorage for user data
3. If no user → Redirect to KYC login (port 3000)
4. If user exists:
   - Select Marketplace (Private/Government)
   - Select Role (Creator/Bidder)
   - Access Dashboard
```

## Integration Points

### Data Flow Between Systems

#### localStorage Keys
```javascript
{
  // Set by KYC System
  "userId": "user_123",
  "userName": "John Doe",
  "userEmail": "john@example.com",
  "userType": "bidder" | "auctionLister",
  "isVerified": true,
  "kycCompleted": true,
  
  // Set by Auction System
  "marketplaceType": "private" | "government",
  "userRole": "creator" | "bidder"
}
```

### API Endpoints

#### KYC Backend (Port 5000)
```
POST /api/auth/register - Upload ID + Selfie
POST /api/auth/verify-and-login - Complete verification
POST /api/auth/login - Login existing user
GET /api/auth/user/:userId - Get user details
GET /api/kyc/status/:userId - Get KYC status
```

#### Auction Backend (Port 3090)
```
POST /api/login - Login (checks KYC verification)
POST /api/auction/create - Create auction
GET /api/auction/all - Get all auctions
GET /api/auction/:id - Get auction details
POST /api/bid/place - Place bid
GET /api/leaderboard - Get top users
```

## Setup Instructions

### 1. Start KYC Backend
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:5000

### 2. Start KYC Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

### 3. Start Auction Backend
```bash
cd smart-Auction-system/backend
npm install
npm start
```
Server runs on http://localhost:3090

### 4. Start Auction Frontend
```bash
cd smart-Auction-system/frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3070

## Integration Features

### ✅ Implemented
- KYC verification with face matching
- User authentication
- User type selection (Bidder/Lister)
- Mock database for KYC
- Landing page with 3D elements
- Dashboard with user info

### 🔄 To Implement
1. **Dashboard Integration**
   - Add "Go to Auction Platform" button
   - Pass user data to auction system
   - Handle verification status

2. **Auction System Auth Check**
   - Verify user is KYC-verified before allowing access
   - Redirect unverified users to KYC registration
   - Show verification badge in auction UI

3. **User Data Sync**
   - Map userType to auction role:
     - `bidder` → Can only bid
     - `auctionLister` → Can create auctions
   - Sync user profile between systems
   - Update leaderboard with KYC user data

4. **Access Control**
   - Middleware to check KYC verification
   - Block unverified users from creating auctions
   - Block unverified users from bidding
   - Show verification status in UI

## Testing Checklist

### KYC System
- [ ] Register new user with ID + Selfie
- [ ] Face matching works (or uses demo score)
- [ ] User data saved correctly
- [ ] Login with email works
- [ ] Dashboard shows user info
- [ ] Verification status displayed

### Auction System
- [ ] Access auction platform from KYC dashboard
- [ ] User data passed correctly
- [ ] Marketplace selection works
- [ ] Role selection works
- [ ] Create auction (lister only)
- [ ] Place bid (bidder only)
- [ ] Real-time bidding works
- [ ] Auto-bid feature works
- [ ] Leaderboard displays correctly

### Integration
- [ ] Unverified user blocked from auctions
- [ ] Verified user can access auctions
- [ ] User type enforced (bidder vs lister)
- [ ] Data syncs between systems
- [ ] Logout clears all data
- [ ] Re-login restores session

## Security Considerations

### KYC System
- Face match score threshold: 60%
- ID and selfie images stored securely
- Blockchain verification hash (future)
- Prevent duplicate registrations

### Auction System
- Only verified users can participate
- User type enforced on backend
- Real-time validation via Socket.io
- Anti-sniping mechanism
- Auto-bid limits enforced

## Troubleshooting

### Issue: User not found in auction system
**Solution**: Ensure user completed KYC verification first

### Issue: Face matching fails
**Solution**: System uses demo score (85%) as fallback

### Issue: Port conflicts
**Solution**: 
- KYC Backend: 5000
- KYC Frontend: 3000
- Auction Backend: 3090
- Auction Frontend: 3070

### Issue: Data not syncing
**Solution**: Check localStorage keys match between systems

## Next Steps

1. Update KYC Dashboard with auction platform link
2. Add verification check in auction frontend
3. Create middleware for access control
4. Test complete user flow
5. Add verification badges in auction UI
6. Implement user profile sync
7. Add logout functionality across both systems

## Support

For issues or questions:
1. Check console logs in both backends
2. Verify all services are running
3. Check localStorage in browser DevTools
4. Ensure face-api.js models are loaded
5. Verify Tesseract.js is working
