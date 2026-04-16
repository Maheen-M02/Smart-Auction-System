# AI-Powered KYC Verification System with Blockchain

A full-stack identity verification system featuring Government ID-based login, OCR extraction, facial recognition, and blockchain-backed proof storage.

## 🚀 Features

- **Government ID Login** - PAN/Aadhaar based authentication
- **OCR Processing** - Automatic identity extraction using Tesseract.js
- **Facial Recognition** - AI-powered face matching with face-api.js
- **Blockchain Storage** - Tamper-proof verification on Polygon testnet
- **Multi-step UI** - Clean, intuitive verification flow
- **Real-time Feedback** - Progress indicators and confidence scores

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- face-api.js
- React Router
- Axios

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Tesseract.js (OCR)
- Multer (file uploads)

### Blockchain
- Solidity smart contract
- Polygon Mumbai testnet
- ethers.js

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- MetaMask wallet with Polygon Mumbai testnet
- MATIC tokens for gas fees (get from faucet)

## 🔧 Installation

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install blockchain dependencies
cd ../blockchain
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB and start service
mongod
```

**Option B: MongoDB Atlas**
- Create free cluster at https://www.mongodb.com/cloud/atlas
- Get connection string

### 3. Deploy Smart Contract

```bash
cd blockchain

# Option 1: Using Remix (Recommended for beginners)
# 1. Go to https://remix.ethereum.org/
# 2. Create new file: KYCVerification.sol
# 3. Copy contract code from blockchain/contracts/KYCVerification.sol
# 4. Compile with Solidity 0.8.0+
# 5. Connect MetaMask to Polygon Mumbai
# 6. Deploy contract
# 7. Copy contract address

# Option 2: Using Hardhat (Advanced)
npm install --save-dev hardhat
npx hardhat init
# Follow Hardhat deployment guide
```

### 4. Configure Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kyc-verification
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/kyc

# Polygon Mumbai Testnet
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_metamask_private_key_here
CONTRACT_ADDRESS=deployed_contract_address_here
```

**Get Polygon Mumbai MATIC:**
- https://faucet.polygon.technology/

### 5. Start the Application

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

Frontend: http://localhost:3000
Backend: http://localhost:5000

## 📱 Usage Flow

### 1. Login
- Enter Government ID (PAN or Aadhaar)
- PAN format: `ABCDE1234F`
- Aadhaar format: `123456789012`

### 2. KYC Verification

**Step 1: Upload**
- Upload ID card image
- Upload selfie photo
- Preview both images

**Step 2: OCR Processing**
- Automatic text extraction
- Name and ID number parsed
- View extracted data

**Step 3: Face Matching**
- AI-powered facial comparison
- Match score calculation
- Confidence level display

**Step 4: Verification Result**
- Final verification status
- Blockchain transaction hash
- Dashboard access

### 3. Dashboard
- View verification status
- See extracted details
- Access blockchain proof
- Ready for auction participation

## 🔐 Security Features

- No passwords required (ID-based auth)
- Only hashed data stored on blockchain
- Local file storage for images
- Tamper-proof verification
- Threshold-based verification (>60% match)

## 📊 API Endpoints

### Authentication
```
POST /api/auth/login
Body: { "govtId": "ABCDE1234F" }
Response: { userId, isVerified, redirectTo }

GET /api/auth/user/:userId
Response: User details
```

### KYC Processing
```
POST /api/kyc/upload
Body: FormData (idImage, selfie, userId)
Response: { success, userId, paths }

POST /api/kyc/ocr
Body: { userId }
Response: { extractedName, idNumber }

POST /api/kyc/verify
Body: { userId, faceMatchScore }
Response: { isVerified, matchScore, blockchainTxHash }

GET /api/kyc/status/:userId
Response: Verification status and details

POST /api/kyc/verify-chain
Body: { userId }
Response: Blockchain integrity check
```

## 🎨 UI Components

- **Login Page** - Government ID input with validation
- **Upload Step** - Drag-and-drop file uploads with preview
- **OCR Step** - Animated processing with extracted data
- **Face Match Step** - Progress bar and confidence meter
- **Result Step** - Status display with blockchain proof
- **Dashboard** - User profile and verification details

## 🔗 Blockchain Integration

### Smart Contract Functions

```solidity
storeKYC(userId, kycHash) - Store verification hash
getKYC(userId) - Retrieve stored hash
```

### Hash Generation
```javascript
kycHash = SHA256(name + idNumber + faceMatchScore)
```

### Verification Flow
1. Generate local hash
2. Store on blockchain
3. Retrieve and compare
4. Confirm integrity

## 🧪 Testing

### Test with Sample Data

**Valid PAN:** `ABCDE1234F`
**Valid Aadhaar:** `123456789012`

### Face Matching Tips
- Use clear, well-lit photos
- Face should be clearly visible
- Similar angles work best
- Threshold: 60% for verification

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy backend folder
```

### Database (MongoDB Atlas)
- Use production connection string
- Enable IP whitelist

## 📦 Project Structure

```
kyc-verification-system/
├── backend/
│   ├── config/          # Database config
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # OCR, blockchain utils
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app
│   └── index.html
├── blockchain/
│   ├── contracts/       # Solidity contracts
│   └── scripts/         # Deployment scripts
└── README.md
```

## 🔧 Troubleshooting

**MongoDB Connection Error:**
- Check MongoDB is running
- Verify connection string
- Check network access (Atlas)

**Face-api.js Model Loading:**
- Models load from CDN
- Check internet connection
- May take time on first load

**Blockchain Transaction Failed:**
- Ensure sufficient MATIC balance
- Check network (Mumbai testnet)
- Verify contract address

**OCR Not Working:**
- Use clear, high-quality images
- Ensure text is readable
- Try different image formats

## 🎯 Integration with Auction Platform

### Response Format
```javascript
{
  isVerified: true,
  matchScore: 0.87,
  blockchainTxHash: "0xabc123...",
  userId: "user_id_here"
}
```

### Usage in Auction System
```javascript
// Check if user can bid
const canBid = user.isVerified && user.kycCompleted;

// Verify blockchain proof
const isValid = await verifyBlockchainProof(userId);
```

## 📝 License

MIT License - Free to use and modify

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for secure identity verification**
