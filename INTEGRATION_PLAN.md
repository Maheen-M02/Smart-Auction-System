# KYC + Smart Auction System Integration Plan

## Overview
Integrate the KYC verification system with the smart auction platform to ensure only verified users can participate in auctions.

## Architecture

```
User Flow:
1. Landing Page (/) → BidBazaar landing with 3D elements
2. Register (/register) → KYC verification (ID + Selfie + Face Match)
3. Login (/login) → Simple login for verified users
4. Dashboard (/dashboard) → Redirect to auction system
5. Auction System → Full auction features (only for verified users)
```

## Integration Strategy

### Backend Integration

#### Option 1: Unified Backend (Recommended)
- Merge both backends into one
- KYC backend (port 5000) becomes the main backend
- Add auction routes to KYC backend
- Single database with unified User model

#### Option 2: Separate Backends with Shared Auth
- Keep backends separate
- KYC backend handles authentication
- Auction backend validates users via KYC backend API
- Requires JWT tokens for auth

### Database Strategy

#### User Model (Unified)
```javascript
{
  // KYC Fields
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
    verificationStatus: String,
    idImagePath: String,
    selfieImagePath: String
  },
  
  // Auction Fields
  totalWins: Number,
  totalSpent: Number,
  
  // Profiles
  bidderProfile: { ... },
  listerProfile: { ... }
}
```

### Frontend Integration

#### Routing Structure
```
KYC Frontend (port 3000):
- / → Landing Page
- /register → KYC Registration
- /login → Login
- /dashboard → Redirect to auction dashboard

Auction Frontend (port 3070):
- /marketplace → Marketplace selection
- /role-selection → Role selection
- /dashboard → Auction dashboard
- /auction/:id → Auction details
- /leaderboard → Leaderboard
```

## Implementation Steps

### Phase 1: Backend Unification
1. ✅ Copy auction routes to KYC backend
2. ✅ Merge User models
3. ✅ Update authentication to include auction fields
4. ✅ Add Socket.io to KYC backend
5. ✅ Test all endpoints

### Phase 2: Frontend Connection
1. ✅ Update KYC dashboard to redirect to auction system
2. ✅ Add authentication check in auction frontend
3. ✅ Pass user data from KYC to auction system
4. ✅ Update auction login to check KYC verification

### Phase 3: Access Control
1. ✅ Middleware to check KYC verification
2. ✅ Block unverified users from auctions
3. ✅ Show verification status in auction UI
4. ✅ Redirect unverified users to KYC registration

### Phase 4: UI/UX Polish
1. ✅ Unified branding (BidBazaar)
2. ✅ Consistent color scheme (Green #10B981, Blue #3B82F6)
3. ✅ Smooth navigation between systems
4. ✅ Clear verification badges

## Technical Details

### Port Configuration
- KYC Backend: 5000
- KYC Frontend: 3000
- Auction Backend: 3090 (or merge into 5000)
- Auction Frontend: 3070

### Authentication Flow
1. User completes KYC on port 3000
2. User data stored with `isVerified: true`
3. User redirected to auction system (port 3070)
4. Auction system checks verification status
5. Only verified users can create/bid on auctions

### Data Synchronization
- Use localStorage to pass userId between systems
- Auction backend queries KYC backend for user verification
- Real-time updates via Socket.io

## Security Considerations
- ✅ Verify KYC status before allowing auction actions
- ✅ Validate face match score threshold (>60%)
- ✅ Store blockchain verification hash
- ✅ Prevent duplicate registrations
- ✅ Secure file uploads

## Testing Checklist
- [ ] Register new user with KYC
- [ ] Login existing user
- [ ] Access auction dashboard
- [ ] Create auction (lister only)
- [ ] Place bid (bidder only)
- [ ] Block unverified user from auctions
- [ ] Test real-time bidding
- [ ] Test auto-bid feature
- [ ] Test leaderboard
- [ ] Test anti-sniping

## Next Steps
1. Implement unified backend
2. Update frontend routing
3. Add verification middleware
4. Test complete flow
5. Deploy integrated system
