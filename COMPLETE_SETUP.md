# Complete KYC System Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 16+ installed
- MongoDB installed and running
- Git (optional)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install blockchain dependencies (optional)
cd ../blockchain
npm install
```

### Step 2: Configure Environment

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kyc-verification
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=deployed_contract_address_here
```

### Step 3: Start MongoDB

```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### Step 4: Run the Application

```bash
# Terminal 1: Start backend
cd backend
npm start

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### Step 5: Access the Application

Open browser: `http://localhost:3000`

---

## 📋 Detailed Setup

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Key Packages**
   - `express`: Web server
   - `mongoose`: MongoDB ODM
   - `multer`: File upload handling
   - `tesseract.js`: OCR processing
   - `ethers`: Blockchain interaction
   - `cors`: Cross-origin requests

3. **Start Server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

4. **Verify Backend**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"OK","message":"KYC Backend Running"}
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Key Packages**
   - `react`: UI framework
   - `react-router-dom`: Routing
   - `axios`: HTTP client
   - `face-api.js`: Facial recognition
   - `tesseract.js`: Client-side OCR
   - `tailwindcss`: Styling

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

### Database Setup

1. **Install MongoDB**
   - Windows: Download from mongodb.com
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt-get install mongodb`

2. **Start MongoDB**
   ```bash
   mongod --dbpath /path/to/data
   ```

3. **Verify Connection**
   ```bash
   mongosh
   > show dbs
   ```

### Blockchain Setup (Optional)

1. **Get Polygon Mumbai Testnet**
   - Add Mumbai to MetaMask
   - Get test MATIC from faucet: https://faucet.polygon.technology/

2. **Deploy Smart Contract**
   - Option A: Use Remix IDE (recommended)
     1. Go to https://remix.ethereum.org/
     2. Create `KYCVerification.sol`
     3. Paste contract code from `blockchain/contracts/KYCVerification.sol`
     4. Compile with Solidity 0.8.0+
     5. Deploy to Mumbai testnet
     6. Copy contract address

   - Option B: Use Hardhat (advanced)
     ```bash
     cd blockchain
     npm install --save-dev hardhat
     npx hardhat init
     # Follow prompts
     npx hardhat run scripts/deploy.js --network mumbai
     ```

3. **Update Environment**
   Add contract address to `backend/.env`:
   ```env
   CONTRACT_ADDRESS=0xYourContractAddress
   ```

---

## 🧪 Testing the System

### Test Flow

1. **Login**
   - Go to `http://localhost:3000/login`
   - Enter Government ID: `ABCDE1234F` (PAN format)
   - Click "Login with Government ID"

2. **KYC Upload**
   - Upload ID card image (clear, readable text)
   - Upload selfie (clear face, good lighting)
   - Click "Upload Documents"

3. **OCR Processing**
   - Wait for text extraction (5-10 seconds)
   - Verify extracted name and ID number
   - Click "Continue to Face Matching"

4. **Face Matching**
   - Wait for face detection (10-15 seconds)
   - View match score and confidence
   - Click "Continue to Verification"

5. **Verification Result**
   - See verification status (✅ or ❌)
   - View blockchain transaction hash
   - Click "Go to Dashboard"

### Test Data

**Valid PAN IDs:**
- `ABCDE1234F`
- `XYZAB5678C`
- `PQRST9012D`

**Valid Aadhaar IDs:**
- `123456789012`
- `987654321098`

### Expected Results

**Successful Verification:**
- Face match score > 60%
- Status: "verified"
- Blockchain TX hash generated
- User can access dashboard

**Failed Verification:**
- Face match score < 60%
- Status: "failed"
- No blockchain storage
- User cannot access dashboard

---

## 🔧 Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```bash
# Check if MongoDB is running
mongosh
# If not, start it:
mongod
```

**Port Already in Use**
```bash
# Change port in backend/.env
PORT=5001
```

**OCR Not Working**
- Check image quality
- Verify Tesseract.js installation
- Try client-side OCR fallback

### Frontend Issues

**Face-API Models Not Loading**
- Check internet connection (using CDN)
- See `FACE_API_SETUP.md` for local setup
- Verify browser console for errors

**CORS Errors**
- Ensure backend is running
- Check proxy configuration in `vite.config.js`
- Verify backend CORS settings

**Images Not Displaying**
- Check backend `/uploads` directory exists
- Verify file paths in responses
- Check browser network tab

### Blockchain Issues

**Transaction Fails**
- Verify wallet has test MATIC
- Check contract address is correct
- Ensure RPC URL is working
- System works without blockchain (demo mode)

---

## 📁 Project Structure

```
kyc-verification-system/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   └── User.js            # User schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── kyc.js             # KYC routes
│   ├── utils/
│   │   ├── ocr.js             # Tesseract.js OCR
│   │   └── blockchain.js      # Ethers.js integration
│   ├── uploads/               # Uploaded images
│   ├── server.js              # Express server
│   ├── package.json
│   └── .env                   # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── models/            # Face-API models (optional)
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadStep.jsx
│   │   │   ├── OCRStep.jsx
│   │   │   ├── FaceMatchStep.jsx
│   │   │   └── ResultStep.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── KYCVerification.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── utils/
│   │   │   └── faceDetection.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── blockchain/
│   ├── contracts/
│   │   └── KYCVerification.sol
│   ├── scripts/
│   │   └── deploy.js
│   └── package.json
│
└── Documentation/
    ├── README.md
    ├── SETUP_GUIDE.md
    ├── FACE_API_SETUP.md
    ├── TESSERACT_SETUP.md
    └── COMPLETE_SETUP.md (this file)
```

---

## 🎯 Feature Checklist

### Authentication
- ✅ Government ID login (PAN/Aadhaar)
- ✅ ID format validation
- ✅ User creation/retrieval
- ✅ Session management

### KYC Verification
- ✅ Multi-step UI (Upload → OCR → Face Match → Result)
- ✅ Image upload (ID + Selfie)
- ✅ OCR text extraction (Tesseract.js)
- ✅ Face detection (face-api.js)
- ✅ Face matching (Euclidean distance)
- ✅ Similarity score calculation
- ✅ Verification threshold (60%)

### Blockchain Integration
- ✅ Smart contract (Solidity)
- ✅ Hash generation (SHA256)
- ✅ Blockchain storage (Polygon)
- ✅ Transaction tracking
- ✅ Integrity verification

### UI/UX
- ✅ Progress stepper
- ✅ Animated loaders
- ✅ Confidence indicators
- ✅ Color-coded results
- ✅ Responsive design
- ✅ Error handling

### Security
- ✅ Hashed data on blockchain
- ✅ Local image storage
- ✅ No raw PII on chain
- ✅ Secure file uploads

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. **Prepare**
   ```bash
   # Add start script to package.json
   "scripts": {
     "start": "node server.js"
   }
   ```

2. **Deploy**
   ```bash
   # Heroku
   heroku create kyc-backend
   heroku config:set MONGODB_URI=your_mongodb_uri
   git push heroku main

   # Railway
   railway init
   railway up
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   ```bash
   # Vercel
   vercel --prod

   # Netlify
   netlify deploy --prod --dir=dist
   ```

3. **Update API URL**
   Change axios base URL to production backend

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review documentation files
3. Check browser/server console logs
4. Verify all dependencies installed

---

## ✅ System Verification

Run this checklist to verify everything works:

- [ ] MongoDB running and connected
- [ ] Backend server starts without errors
- [ ] Frontend dev server starts
- [ ] Can access login page
- [ ] Can login with test ID
- [ ] Can upload images
- [ ] OCR extracts text
- [ ] Face matching completes
- [ ] Verification result displays
- [ ] Dashboard accessible after verification

---

## 🎉 Success!

Your KYC verification system is now ready to use!

**Next Steps:**
1. Test with real ID images
2. Deploy to production
3. Integrate with auction platform
4. Add additional security features
5. Implement user management
