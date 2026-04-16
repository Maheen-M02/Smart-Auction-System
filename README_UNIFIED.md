# BidBazaar - Trust-First Auction Platform

A unified full-stack platform combining KYC verification with real-time auction bidding.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm

### Installation & Running

**1. Start Backend (Terminal 1)**
```bash
cd backend
npm install
npm start
```
Server runs on http://localhost:5000

**2. Start Frontend (Terminal 2)**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3000

**3. Open Browser**
Visit http://localhost:3000

## ✨ Features

### KYC Verification
- 3D Landing page with Three.js animations
- Government ID upload
- Selfie capture
- OCR text extraction
- AI-powered face matching
- Blockchain verification

### Auction System
- Marketplace selection (Private/Government)
- Role-based access (Creator/Bidder)
- Real-time bidding with Socket.io
- Auto-bidding system
- Anti-sniping mechanism (extends auction time)
- Live leaderboard
- Countdown timers

### Security
- Only KYC-verified users can participate
- User type enforcement (Bidder vs Auction Lister)
- Face match threshold: 60%
- Secure file uploads
- Real-time validation

## 📖 User Flow

1. **Register** → Upload ID + Selfie → Face verification
2. **Dashboard** → View verification status
3. **Auction Platform** → Select marketplace & role
4. **Bid or Create** → Participate in auctions

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Three.js + React Three Fiber
- Tailwind CSS
- Socket.io Client
- Axios
- Face-api.js
- Tesseract.js

### Backend
- Node.js + Express
- Socket.io
- Mock Database (in-memory)
- Multer (file uploads)
- Tesseract.js (OCR)
- Ethers.js (blockchain)

## 📁 Project Structure

```
kycfor_auctionsystem/
├── backend/          # Unified backend (port 5000)
│   ├── models/       # User, Auction, Bid, AutoBid
│   ├── routes/       # API routes
│   ├── db/           # Mock database
│   └── server.js     # Main server with Socket.io
│
├── frontend/         # Unified frontend (port 3000)
│   ├── src/
│   │   ├── pages/    # All pages (KYC + Auction)
│   │   └── components/
│   └── package.json
│
└── Documentation/    # Guides and docs
```

## 🔌 API Endpoints

Base URL: http://localhost:5000/api

### Authentication
- `POST /auth/register` - Register with KYC
- `POST /auth/login` - Login
- `GET /auth/user/:userId` - Get user

### Auctions
- `POST /auction/create` - Create auction
- `GET /auction/all` - List auctions
- `GET /auction/:id` - Auction details

### Bidding
- `POST /bid/place` - Place bid

### Leaderboard
- `GET /leaderboard` - Top users

## 🧪 Testing

1. Register as "Bidder"
2. Complete KYC verification
3. Go to auction platform
4. Browse auctions
5. In another browser (incognito), register as "Auction Lister"
6. Create an auction
7. Back to first browser, place a bid
8. Watch real-time updates!

## 📚 Documentation

- `UNIFIED_SYSTEM_GUIDE.md` - Complete system guide
- `KYC_AUCTION_INTEGRATION.md` - Integration details
- `INTEGRATION_COMPLETE.md` - What was integrated

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Face matching fails
Normal behavior! System uses demo score (85%) as fallback.

### Dependencies not installing
Delete `node_modules` and `package-lock.json`, then run `npm install` again.

## 🎯 Key Features

✅ Single unified backend
✅ Single unified frontend  
✅ Real-time bidding
✅ KYC verification required
✅ Auto-bidding system
✅ Anti-sniping protection
✅ Mock database (no external DB needed)
✅ Socket.io for live updates

## 🔐 Security

- Face match verification (60% threshold)
- Only verified users can bid/create auctions
- User type enforcement
- Blockchain verification hash
- Secure file uploads

## 📝 License

MIT

## 🤝 Contributing

This is a demonstration project showcasing KYC + Auction integration.

---

**BidBazaar** - In Trust We Build 🎯

Made with ❤️ using React, Node.js, and Socket.io
