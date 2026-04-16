# Auction Platform Integration Guide

## 🎯 Integration Overview

This KYC system is designed to integrate seamlessly with your auction platform. Users must complete KYC verification before they can place bids.

## 🔗 Integration Flow

```
User Registration (Auction Platform)
    ↓
Redirect to KYC System
    ↓
Complete Verification
    ↓
Return to Auction Platform
    ↓
Enable Bidding
```

## 📡 API Integration

### 1. Check User Verification Status

**Endpoint:** `GET /api/kyc/status/:userId`

**Example:**
```javascript
const checkKYCStatus = async (userId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/kyc/status/${userId}`);
    const data = await response.json();
    
    return {
      isVerified: data.isVerified,
      canBid: data.isVerified && data.verificationStatus === 'verified',
      matchScore: data.faceMatchScore,
      blockchainProof: data.blockchainTxHash
    };
  } catch (error) {
    console.error('KYC check failed:', error);
    return { isVerified: false, canBid: false };
  }
};
```

**Response:**
```json
{
  "isVerified": true,
  "verificationStatus": "verified",
  "faceMatchScore": 0.87,
  "blockchainTxHash": "0xabc123...",
  "extractedName": "John Doe",
  "idNumber": "ABCDE1234F"
}
```

### 2. Verify Blockchain Proof

**Endpoint:** `POST /api/kyc/verify-chain`

**Example:**
```javascript
const verifyBlockchainProof = async (userId) => {
  try {
    const response = await fetch('http://localhost:5000/api/kyc/verify-chain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    
    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Blockchain verification failed:', error);
    return false;
  }
};
```

## 🎨 Frontend Integration

### Option 1: Embedded iFrame

```html
<!-- In your auction platform -->
<div id="kyc-container">
  <iframe 
    src="http://localhost:3000/kyc?userId=USER_ID" 
    width="100%" 
    height="800px"
    frameborder="0">
  </iframe>
</div>
```

### Option 2: Redirect Flow

```javascript
// Redirect to KYC system
const startKYC = (userId) => {
  window.location.href = `http://localhost:3000/kyc?userId=${userId}&returnUrl=${encodeURIComponent(window.location.href)}`;
};

// Handle return from KYC
const handleKYCReturn = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const verified = urlParams.get('verified');
  
  if (verified === 'true') {
    showSuccessMessage('KYC verification complete! You can now bid.');
  }
};
```

### Option 3: Modal Popup

```javascript
const openKYCModal = (userId) => {
  const modal = document.createElement('div');
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <iframe 
          src="http://localhost:3000/kyc?userId=${userId}&mode=modal" 
          width="800px" 
          height="600px">
        </iframe>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};
```

## 🔐 Bidding Authorization

### Before Allowing Bid

```javascript
const canUserBid = async (userId, auctionId) => {
  // 1. Check KYC status
  const kycStatus = await checkKYCStatus(userId);
  
  if (!kycStatus.canBid) {
    return {
      allowed: false,
      reason: 'KYC verification required',
      action: 'redirect_to_kyc'
    };
  }
  
  // 2. Verify blockchain proof (optional but recommended)
  const isValid = await verifyBlockchainProof(userId);
  
  if (!isValid) {
    return {
      allowed: false,
      reason: 'Blockchain verification failed',
      action: 'contact_support'
    };
  }
  
  // 3. Additional auction-specific checks
  // (e.g., deposit, previous bids, etc.)
  
  return {
    allowed: true,
    userInfo: {
      name: kycStatus.extractedName,
      verified: true,
      matchScore: kycStatus.matchScore
    }
  };
};
```

### Usage in Bid Handler

```javascript
const handleBidSubmit = async (userId, auctionId, bidAmount) => {
  // Check authorization
  const auth = await canUserBid(userId, auctionId);
  
  if (!auth.allowed) {
    if (auth.action === 'redirect_to_kyc') {
      // Redirect to KYC
      window.location.href = `/kyc?userId=${userId}`;
      return;
    }
    
    alert(auth.reason);
    return;
  }
  
  // Process bid
  const bid = await submitBid(userId, auctionId, bidAmount);
  
  // Log with KYC proof
  logBid({
    ...bid,
    kycVerified: true,
    blockchainProof: auth.userInfo.blockchainProof
  });
};
```

## 📊 Database Integration

### Auction User Schema Extension

```javascript
// Add to your existing user schema
{
  userId: ObjectId,
  email: String,
  // ... existing fields
  
  // KYC Integration
  kycVerified: Boolean,
  kycUserId: String,  // Reference to KYC system
  kycCompletedAt: Date,
  kycBlockchainProof: String,
  
  // Bidding permissions
  canBid: Boolean,
  biddingEnabled: Boolean
}
```

### Sync KYC Status

```javascript
const syncKYCStatus = async (auctionUserId, kycUserId) => {
  const kycStatus = await checkKYCStatus(kycUserId);
  
  await AuctionUser.updateOne(
    { _id: auctionUserId },
    {
      $set: {
        kycVerified: kycStatus.isVerified,
        kycUserId: kycUserId,
        kycCompletedAt: new Date(),
        kycBlockchainProof: kycStatus.blockchainProof,
        canBid: kycStatus.canBid,
        biddingEnabled: kycStatus.canBid
      }
    }
  );
};
```

## 🎯 UI Components

### Verification Badge

```jsx
const VerificationBadge = ({ userId }) => {
  const [verified, setVerified] = useState(false);
  
  useEffect(() => {
    checkKYCStatus(userId).then(status => {
      setVerified(status.isVerified);
    });
  }, [userId]);
  
  return (
    <div className={`badge ${verified ? 'verified' : 'unverified'}`}>
      {verified ? '✅ Verified' : '⏳ Verification Required'}
    </div>
  );
};
```

### Bid Button with KYC Check

```jsx
const BidButton = ({ userId, auctionId, onBid }) => {
  const [canBid, setCanBid] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    canUserBid(userId, auctionId).then(auth => {
      setCanBid(auth.allowed);
      setLoading(false);
    });
  }, [userId, auctionId]);
  
  const handleClick = () => {
    if (canBid) {
      onBid();
    } else {
      window.location.href = `/kyc?userId=${userId}`;
    }
  };
  
  if (loading) return <button disabled>Loading...</button>;
  
  return (
    <button onClick={handleClick} className="bid-button">
      {canBid ? 'Place Bid' : 'Complete KYC to Bid'}
    </button>
  );
};
```

## 🔔 Webhook Integration (Optional)

### Setup Webhook Endpoint

```javascript
// In your auction platform backend
app.post('/webhooks/kyc-verified', async (req, res) => {
  const { userId, isVerified, blockchainTxHash } = req.body;
  
  // Verify webhook signature (implement your security)
  
  // Update user status
  await syncKYCStatus(userId, userId);
  
  // Send notification
  await sendEmail(userId, 'KYC Verification Complete');
  
  res.json({ success: true });
});
```

### Configure in KYC System

```javascript
// In backend/routes/kyc.js after verification
if (user.isVerified) {
  // Call webhook
  await axios.post('http://auction-platform.com/webhooks/kyc-verified', {
    userId: user._id,
    isVerified: true,
    blockchainTxHash: user.kycData.blockchainTxHash
  });
}
```

## 📱 Mobile App Integration

### React Native Example

```javascript
import { WebView } from 'react-native-webview';

const KYCScreen = ({ userId, navigation }) => {
  const handleMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    
    if (data.type === 'kyc_complete') {
      navigation.navigate('Dashboard', { verified: true });
    }
  };
  
  return (
    <WebView
      source={{ uri: `http://localhost:3000/kyc?userId=${userId}&mode=mobile` }}
      onMessage={handleMessage}
    />
  );
};
```

## 🔒 Security Best Practices

### 1. Validate on Server Side

```javascript
// Never trust client-side verification
const processBid = async (userId, bidData) => {
  // Always check on server
  const kycStatus = await checkKYCStatus(userId);
  
  if (!kycStatus.canBid) {
    throw new Error('KYC verification required');
  }
  
  // Process bid
};
```

### 2. Cache KYC Status

```javascript
// Use Redis or similar for caching
const getCachedKYCStatus = async (userId) => {
  const cached = await redis.get(`kyc:${userId}`);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const status = await checkKYCStatus(userId);
  await redis.setex(`kyc:${userId}`, 3600, JSON.stringify(status));
  
  return status;
};
```

### 3. Rate Limiting

```javascript
// Limit KYC check requests
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/kyc', rateLimiter);
```

## 📊 Analytics Integration

### Track KYC Funnel

```javascript
const trackKYCEvent = (event, userId, data) => {
  analytics.track({
    event: `kyc_${event}`,
    userId,
    properties: {
      ...data,
      timestamp: new Date()
    }
  });
};

// Usage
trackKYCEvent('started', userId);
trackKYCEvent('upload_complete', userId);
trackKYCEvent('verification_success', userId, { matchScore: 0.87 });
```

## 🎉 Complete Integration Example

```javascript
// Complete auction platform integration
class AuctionKYCIntegration {
  constructor(kycApiUrl) {
    this.apiUrl = kycApiUrl;
  }
  
  async checkVerification(userId) {
    const response = await fetch(`${this.apiUrl}/api/kyc/status/${userId}`);
    return await response.json();
  }
  
  async verifyBlockchain(userId) {
    const response = await fetch(`${this.apiUrl}/api/kyc/verify-chain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await response.json();
  }
  
  async canPlaceBid(userId) {
    const status = await this.checkVerification(userId);
    const blockchainValid = await this.verifyBlockchain(userId);
    
    return {
      allowed: status.isVerified && blockchainValid.isValid,
      status,
      blockchainValid
    };
  }
  
  getKYCUrl(userId, returnUrl) {
    return `${this.apiUrl}/kyc?userId=${userId}&returnUrl=${encodeURIComponent(returnUrl)}`;
  }
}

// Usage
const kycIntegration = new AuctionKYCIntegration('http://localhost:5000');

// Before bid
const bidAuth = await kycIntegration.canPlaceBid(userId);
if (!bidAuth.allowed) {
  window.location.href = kycIntegration.getKYCUrl(userId, window.location.href);
}
```

## 📝 Environment Configuration

```env
# Add to your auction platform .env
KYC_API_URL=http://localhost:5000
KYC_FRONTEND_URL=http://localhost:3000
KYC_WEBHOOK_SECRET=your_webhook_secret_here
KYC_CACHE_TTL=3600
```

---

**Integration complete! Your auction platform now has secure KYC verification. 🎉**
