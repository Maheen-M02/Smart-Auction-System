# Testing Guide

## 🧪 Complete Testing Workflow

### Test Case 1: New User Registration

**Input:**
- Government ID: `ABCDE1234F` (PAN format)

**Expected:**
- User created successfully
- Redirected to KYC page
- Status: Not verified

### Test Case 2: Existing Verified User

**Input:**
- Government ID: Previously registered ID

**Expected:**
- Login successful
- Redirected to dashboard
- Status: Verified (if KYC completed)

### Test Case 3: Invalid Government ID

**Input:**
- `ABC123` (Invalid format)
- `12345` (Too short)

**Expected:**
- Error message displayed
- Login blocked

### Test Case 4: KYC Upload

**Preparation:**
- Use sample ID card image
- Use sample selfie photo

**Steps:**
1. Click "Choose File" for ID
2. Select image
3. Preview appears
4. Click "Choose File" for selfie
5. Select image
6. Preview appears
7. Click "Continue to OCR"

**Expected:**
- Both images uploaded
- Files stored in `backend/uploads/`
- Redirected to OCR step

### Test Case 5: OCR Processing

**Expected:**
- Loading animation appears
- Text extracted from ID
- Name displayed
- ID number displayed
- "Continue to Face Matching" button enabled

**Note:** OCR accuracy depends on image quality

### Test Case 6: Face Matching - High Score

**Preparation:**
- Use similar photos (same person)

**Expected:**
- Loading with progress messages
- Match score > 70%
- Confidence: High
- Green progress bar
- Success message

### Test Case 7: Face Matching - Low Score

**Preparation:**
- Use different people's photos

**Expected:**
- Match score < 60%
- Confidence: Low
- Red/Yellow progress bar
- Warning message

### Test Case 8: Verification Success

**Prerequisites:**
- Face match score > 60%

**Expected:**
- Status: Verified ✅
- Green success card
- Blockchain transaction hash displayed
- "Go to Dashboard" button
- "Start Bidding" button

### Test Case 9: Verification Failure

**Prerequisites:**
- Face match score < 60%

**Expected:**
- Status: Failed ❌
- Red failure card
- No blockchain transaction
- Option to retry

### Test Case 10: Dashboard View

**Expected:**
- User details displayed
- Verification status shown
- Match score visible
- Blockchain transaction hash
- Logout button functional

## 🔍 API Testing with cURL

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"govtId":"ABCDE1234F"}'
```

### Test User Status
```bash
curl http://localhost:5000/api/auth/user/USER_ID_HERE
```

### Test KYC Status
```bash
curl http://localhost:5000/api/kyc/status/USER_ID_HERE
```

### Test Health Check
```bash
curl http://localhost:5000/api/health
```

## 📊 Expected Response Formats

### Login Response (New User)
```json
{
  "success": true,
  "message": "New user created. Please complete KYC verification.",
  "userId": "507f1f77bcf86cd799439011",
  "isVerified": false,
  "kycCompleted": false,
  "idType": "PAN",
  "redirectTo": "/kyc"
}
```

### Login Response (Verified User)
```json
{
  "success": true,
  "message": "Login successful",
  "userId": "507f1f77bcf86cd799439011",
  "isVerified": true,
  "kycCompleted": true,
  "idType": "PAN",
  "redirectTo": "/dashboard"
}
```

### Verification Response
```json
{
  "success": true,
  "isVerified": true,
  "matchScore": 0.87,
  "verificationStatus": "verified",
  "blockchainTxHash": "0xabc123...",
  "kycHash": "a1b2c3d4..."
}
```

## 🎯 Performance Benchmarks

### Expected Timings
- Login: < 500ms
- File Upload: < 2s
- OCR Processing: 3-10s (depends on image)
- Face Matching: 5-15s (first load slower)
- Verification: < 1s
- Blockchain Storage: 10-30s (testnet)

## 🐛 Known Issues & Workarounds

### Issue 1: OCR Accuracy
**Problem:** Text not extracted correctly
**Solution:** 
- Use high-quality images
- Ensure good lighting
- Text should be clear and readable

### Issue 2: Face-api Models Loading
**Problem:** Long initial load time
**Solution:**
- Models load from CDN (first time only)
- Subsequent loads are cached
- Check internet connection

### Issue 3: Blockchain Transaction Pending
**Problem:** Transaction takes long time
**Solution:**
- Mumbai testnet can be slow
- Check transaction on PolygonScan
- Increase gas price if needed

### Issue 4: CORS Errors
**Problem:** Frontend can't reach backend
**Solution:**
- Ensure backend is running on port 5000
- Check Vite proxy configuration
- Verify CORS is enabled in backend

## ✅ Validation Checklist

### Government ID Validation
- [x] PAN: 5 letters + 4 digits + 1 letter
- [x] Aadhaar: 12 digits
- [x] Case insensitive
- [x] Whitespace trimmed

### File Upload Validation
- [x] Image files only
- [x] File size limits
- [x] Preview generation
- [x] Secure storage

### Face Matching Validation
- [x] Face detection in both images
- [x] Descriptor extraction
- [x] Distance calculation
- [x] Score normalization (0-1)

### Verification Logic
- [x] Threshold: 60%
- [x] Status updates
- [x] Hash generation
- [x] Blockchain storage

## 🔐 Security Testing

### Test Cases
1. **SQL Injection:** Try `'; DROP TABLE users; --` in govtId
2. **XSS:** Try `<script>alert('xss')</script>` in inputs
3. **File Upload:** Try uploading non-image files
4. **Large Files:** Try uploading very large images
5. **Duplicate IDs:** Try registering same ID twice

### Expected Behavior
- All malicious inputs sanitized
- File type validation enforced
- Duplicate IDs handled gracefully
- Error messages don't leak info

## 📈 Load Testing

### Simple Load Test
```bash
# Install Apache Bench
# Test login endpoint
ab -n 100 -c 10 -p login.json -T application/json \
  http://localhost:5000/api/auth/login
```

### Expected Results
- 100 requests in < 10s
- No failed requests
- Consistent response times

## 🎨 UI/UX Testing

### Checklist
- [ ] Responsive on mobile
- [ ] Buttons have hover states
- [ ] Loading states visible
- [ ] Error messages clear
- [ ] Success feedback obvious
- [ ] Navigation intuitive
- [ ] Images preview correctly
- [ ] Progress bar animates smoothly

## 📱 Browser Compatibility

### Tested Browsers
- Chrome/Edge (Recommended)
- Firefox
- Safari
- Mobile browsers

### Known Limitations
- face-api.js requires modern browser
- File upload needs HTML5 support
- Canvas API required

## 🚀 Integration Testing

### Auction Platform Integration
```javascript
// Example integration code
const checkUserVerification = async (userId) => {
  const response = await fetch(`/api/kyc/status/${userId}`);
  const data = await response.json();
  
  if (data.isVerified && data.verificationStatus === 'verified') {
    // Allow bidding
    return true;
  }
  return false;
};
```

## 📝 Test Data

### Valid Government IDs
- PAN: `ABCDE1234F`, `XYZAB5678C`, `PQRST9012M`
- Aadhaar: `123456789012`, `987654321098`

### Test Images
- Use clear, well-lit photos
- Face should be visible
- ID text should be readable
- Similar angles for matching

---

**Happy Testing! 🎉**
