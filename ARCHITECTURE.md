# System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Frontend (Vite)                                │  │
│  │  - Login Page                                         │  │
│  │  - KYC Verification Flow                             │  │
│  │  - Dashboard                                          │  │
│  │  - face-api.js (Client-side Face Matching)          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                       API LAYER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js Backend                                   │  │
│  │  - Authentication Routes (/api/auth)                 │  │
│  │  - KYC Routes (/api/kyc)                            │  │
│  │  - File Upload Handler (Multer)                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    PROCESSING LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ OCR Engine   │  │  Blockchain  │  │   Crypto     │     │
│  │ Tesseract.js │  │  ethers.js   │  │   SHA-256    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                     STORAGE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   MongoDB    │  │  File System │  │  Blockchain  │     │
│  │  (User Data) │  │  (Images)    │  │  (Hashes)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. User Registration Flow
```
User Input (Govt ID)
    ↓
Validation (Regex)
    ↓
Check Existing User (MongoDB)
    ↓
Create/Return User
    ↓
Redirect (KYC/Dashboard)
```

### 2. KYC Verification Flow
```
Upload Images (ID + Selfie)
    ↓
Store Files (Local/S3)
    ↓
OCR Processing (Tesseract.js)
    ├─ Extract Name
    └─ Extract ID Number
    ↓
Face Matching (face-api.js)
    ├─ Detect Faces
    ├─ Generate Descriptors
    └─ Calculate Similarity
    ↓
Verification Logic
    ├─ Score > 60% → Verified
    └─ Score ≤ 60% → Failed
    ↓
Generate Hash (SHA-256)
    ↓
Store on Blockchain (Polygon)
    ↓
Save Transaction Hash (MongoDB)
    ↓
Return Result
```

### 3. Blockchain Storage Flow
```
Verification Data
    ↓
Generate Hash
    ↓
Connect Wallet (ethers.js)
    ↓
Call Smart Contract
    ↓
Wait for Confirmation
    ↓
Store Transaction Hash
```

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  govtId: String (unique, indexed),
  name: String,
  email: String,
  isVerified: Boolean,
  kycCompleted: Boolean,
  kycData: {
    extractedName: String,
    idNumber: String,
    faceMatchScore: Number,
    kycHash: String,
    blockchainTxHash: String,
    verificationStatus: Enum['pending', 'verified', 'failed'],
    idImagePath: String,
    selfieImagePath: String
  },
  createdAt: Date
}
```

### Indexes
```javascript
govtId: unique index
createdAt: index for sorting
isVerified: index for queries
```

## 🔐 Security Architecture

### Authentication
- Government ID-based (no passwords)
- Session stored in localStorage
- User ID used for API calls

### Data Protection
- Raw images: Local storage only
- Personal data: MongoDB (encrypted at rest)
- Blockchain: Only hashed data
- No PII on blockchain

### API Security
- CORS enabled for frontend
- Input validation on all endpoints
- File type validation
- Size limits on uploads

## 🧩 Component Architecture

### Frontend Components

```
App.jsx
├── Router
    ├── Login.jsx
    │   └── Government ID input
    │   └── Validation
    │   └── API call
    │
    ├── KYCVerification.jsx
    │   ├── Stepper UI
    │   ├── UploadStep.jsx
    │   │   ├── ID upload
    │   │   └── Selfie upload
    │   ├── OCRStep.jsx
    │   │   └── Text extraction
    │   ├── FaceMatchStep.jsx
    │   │   ├── face-api.js integration
    │   │   └── Score calculation
    │   └── ResultStep.jsx
    │       ├── Verification status
    │       └── Blockchain proof
    │
    └── Dashboard.jsx
        ├── User info
        ├── Verification status
        └── Blockchain details
```

### Backend Routes

```
server.js
├── /api/auth
│   ├── POST /login
│   └── GET /user/:userId
│
└── /api/kyc
    ├── POST /upload
    ├── POST /ocr
    ├── POST /verify
    ├── GET /status/:userId
    └── POST /verify-chain
```

## 🔧 Technology Decisions

### Why React + Vite?
- Fast development
- Hot module replacement
- Modern build tool
- Small bundle size

### Why face-api.js?
- Client-side processing
- No external API costs
- Privacy-friendly
- Good accuracy

### Why Tesseract.js?
- Free and open-source
- No API limits
- Works offline
- Multiple languages

### Why MongoDB?
- Flexible schema
- Easy to scale
- Good for JSON data
- Fast queries

### Why Polygon?
- Low gas fees
- Fast transactions
- Ethereum-compatible
- Good for testing

## 📈 Scalability Considerations

### Current Limitations
- File storage: Local disk
- Face matching: Client-side (slow)
- OCR: Server-side (CPU intensive)

### Scaling Solutions

**For 1,000+ users:**
- Move to cloud storage (S3)
- Add Redis caching
- Load balancer

**For 10,000+ users:**
- Microservices architecture
- Separate OCR service
- CDN for static assets
- Database sharding

**For 100,000+ users:**
- Kubernetes orchestration
- Message queue (RabbitMQ)
- Dedicated blockchain node
- Multi-region deployment

## 🔄 State Management

### Frontend State
- Local state (useState)
- URL state (React Router)
- localStorage (userId)

### Backend State
- Stateless API
- Database persistence
- No session management

## 🌐 API Design

### RESTful Principles
- Resource-based URLs
- HTTP methods (GET, POST)
- JSON responses
- Status codes

### Response Format
```javascript
// Success
{
  success: true,
  data: {...},
  message: "Operation successful"
}

// Error
{
  success: false,
  error: "Error message"
}
```

## 🔗 Integration Points

### Auction Platform Integration
```javascript
// Check verification before bidding
const canBid = await checkKYCStatus(userId);

// Verify blockchain proof
const isValid = await verifyBlockchainProof(userId);

// Get user details
const user = await getUserDetails(userId);
```

### Webhook Support (Future)
```javascript
// Notify auction platform on verification
POST /webhook/kyc-verified
{
  userId: "...",
  isVerified: true,
  timestamp: "..."
}
```

## 📊 Monitoring & Logging

### Metrics to Track
- Registration rate
- Verification success rate
- Average processing time
- Blockchain transaction status
- Error rates

### Logging Strategy
- Request/response logs
- Error logs with stack traces
- Blockchain transaction logs
- Performance metrics

## 🚀 Deployment Architecture

### Development
```
localhost:3000 (Frontend)
localhost:5000 (Backend)
localhost:27017 (MongoDB)
Mumbai Testnet (Blockchain)
```

### Production
```
CDN (Frontend)
Load Balancer → App Servers (Backend)
MongoDB Atlas (Database)
Polygon Mainnet (Blockchain)
S3 (File Storage)
```

---

**This architecture supports the current MVP and can scale to production needs.**
