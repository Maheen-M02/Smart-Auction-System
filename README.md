# Smart Auction System (BidBazaar)

A full-stack auction platform that combines **KYC verification**, **real-time bidding**, and **blockchain-based verification**.

This repository is organized into:
- `backend/` — API server + KYC verification + real-time bidding (Socket.io)
- `frontend/` — client UI (Vite + React)  
- `blockchain/` — scripts/contracts integration for verification proof storage

## Key Features
- KYC verification (ID + selfie + face match flow)
- Real-time bidding with **Socket.io**
- Auto-bidding system
- Anti-sniping protection
- Live leaderboard
- 3D landing page (as mentioned in quick start notes)
- Blockchain verification integration (Polygon RPC env present)

## Tech Stack
### Backend
- Node.js + Express
- MongoDB (Mongoose)
- File uploads (Multer)
- OCR (Tesseract.js)
- Blockchain interaction (Ethers)
- Real-time events (Socket.io)

### Frontend
- Vite + React
- Tailwind CSS

### Blockchain
- Ethers-based deployment scripts
- Smart contracts located in `blockchain/contracts/`

## Quick Start (2 terminals)

### 1) Start backend
```bash
cd backend
npm install
npm start
```
Backend runs at: `http://localhost:5000`

### 2) Start frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:3000`

Open in browser:
- `http://localhost:3000`

## Environment Variables (Backend)

Copy the example env file:
```bash
cd backend
cp .env.example .env
```

Example `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kyc-verification
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=deployed_contract_address_here
```

## Helpful Commands
From the repository root:
```bash
npm run install-all
```
This installs dependencies for root + frontend + blockchain (as defined in `package.json`).

## Basic Test Flow
1. Click **Get Started / Register**
2. Choose **Bidder** or **Auction Lister**
3. Upload 2 images (ID + selfie)
4. Verification completes (demo fallback may be used)
5. Enter the auction platform and start bidding/creating auctions

## License
MIT (as indicated by the root `package.json`)

## Authors
Maheen Meshram, Varun Mundhada, Atharv Jaiswal, Mrudang Wanjari
Maintained by the repository contributors.
