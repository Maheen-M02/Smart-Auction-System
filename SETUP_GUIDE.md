# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (2 min)

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Setup MongoDB (1 min)

**Quick Option - MongoDB Atlas (Free):**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string

### Step 3: Configure Backend (1 min)

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here

# For demo without blockchain, use these placeholders:
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=demo_key
CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
```

### Step 4: Run Application (1 min)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:3000

## ✅ Test the System

### Login
- Enter: `ABCDE1234F` (PAN format)
- Or: `123456789012` (Aadhaar format)

### KYC Flow
1. Upload any ID card image
2. Upload any selfie photo
3. Watch OCR extract text
4. See face matching in action
5. Get verification result

## 🔗 Optional: Blockchain Setup

### Get Polygon Mumbai Testnet Setup

1. **Install MetaMask**
   - https://metamask.io/

2. **Add Mumbai Network**
   - Network Name: Mumbai Testnet
   - RPC URL: https://rpc-mumbai.maticvigil.com
   - Chain ID: 80001
   - Currency: MATIC

3. **Get Test MATIC**
   - https://faucet.polygon.technology/

4. **Deploy Contract**
   - Go to https://remix.ethereum.org/
   - Create file: KYCVerification.sol
   - Copy code from `blockchain/contracts/KYCVerification.sol`
   - Compile (Solidity 0.8.0+)
   - Deploy to Mumbai
   - Copy contract address to `.env`

## 🎯 Demo Mode

The system works in demo mode without blockchain:
- All features functional
- Verification works
- Blockchain transactions simulated
- Perfect for testing and development

## 📱 Features to Test

✅ Government ID validation (PAN/Aadhaar)
✅ File upload with preview
✅ OCR text extraction
✅ Face matching with score
✅ Verification threshold (>60%)
✅ Dashboard with status
✅ Blockchain proof (if configured)

## 🐛 Common Issues

**Port already in use:**
```bash
# Change PORT in backend/.env
PORT=5001
```

**MongoDB connection failed:**
- Check connection string
- Ensure IP is whitelisted (Atlas)
- Try local MongoDB: `mongodb://localhost:27017/kyc`

**Face-api models not loading:**
- Check internet connection
- Models load from CDN
- Wait a few seconds on first load

## 🎨 Customization

### Change Verification Threshold
Edit `backend/routes/kyc.js`:
```javascript
if (faceMatchScore > 0.6) { // Change 0.6 to your threshold
```

### Modify UI Colors
Edit `frontend/tailwind.config.js` for theme customization

### Add More ID Types
Edit `backend/routes/auth.js` validation regex

## 📚 Next Steps

1. Test with real ID images
2. Deploy smart contract for production
3. Configure cloud storage (AWS S3)
4. Add email notifications
5. Integrate with auction platform

## 🔐 Production Checklist

- [ ] Use production MongoDB
- [ ] Deploy smart contract to mainnet
- [ ] Configure cloud storage
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Add backup system
- [ ] Configure CORS properly

## 💡 Tips

- Use clear, high-quality images for best OCR results
- Face matching works best with similar lighting
- Test with multiple ID types
- Monitor blockchain gas fees
- Keep private keys secure

---

**Need help? Check README.md for detailed documentation**
