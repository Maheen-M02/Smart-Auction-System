# Quick Start Guide - BidBazaar Platform

## Start All Services

You need to run 4 terminals simultaneously:

### Terminal 1: KYC Backend
```bash
cd backend
npm start
```
✅ Running on http://localhost:5000

### Terminal 2: KYC Frontend
```bash
cd frontend
npm run dev
```
✅ Running on http://localhost:3000

### Terminal 3: Auction Backend
```bash
cd smart-Auction-system/backend
npm start
```
✅ Running on http://localhost:3090

### Terminal 4: Auction Frontend
```bash
cd smart-Auction-system/frontend
npm run dev
```
✅ Running on http://localhost:3070

## Access the Platform

1. **Start Here**: http://localhost:3000
   - Landing page with 3D elements
   - Register or Login

2. **After KYC**: Click "Go to Auction Platform"
   - Automatically redirects to http://localhost:3070
   - Select marketplace and role
   - Start bidding or creating auctions

## Quick Test Flow

1. Open http://localhost:3000
2. Click "Get Started - Register Now"
3. Fill in details (choose Bidder or Auction Lister)
4. Upload any 2 images (ID and Selfie)
5. Wait for verification (auto-completes with demo score)
6. Click "Go to Auction Platform"
7. Select marketplace type
8. Select your role
9. Start using the auction system!

## Ports Summary

| Service | Port | URL |
|---------|------|-----|
| KYC Backend | 5000 | http://localhost:5000 |
| KYC Frontend | 3000 | http://localhost:3000 |
| Auction Backend | 3090 | http://localhost:3090 |
| Auction Frontend | 3070 | http://localhost:3070 |

## Troubleshooting

### Port Conflicts
If you get "port already in use" errors:

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Services Not Starting
1. Make sure you ran `npm install` in each directory first
2. Check if Node.js is installed: `node --version`
3. Check console for error messages

### Face Detection Fails
This is normal! The system uses a demo score (85%) as fallback.

## Need Help?

Check these files:
- `KYC_AUCTION_INTEGRATION.md` - Complete integration guide
- `INTEGRATION_GUIDE.md` - Detailed setup instructions
- `INTEGRATION_PLAN.md` - Architecture overview
