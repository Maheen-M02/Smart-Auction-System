# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Frontend Issues

#### 1. PostCSS/Autoprefixer Error
```
Error: Cannot find module 'autoprefixer'
```

**Solution:**
```bash
cd frontend
npm install autoprefixer postcss
```

#### 2. Tailwind CSS Not Working
```
Styles not applying
```

**Solution:**
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### 3. Vite Port Already in Use
```
Port 3000 is already in use
```

**Solution:**
```bash
# Option 1: Kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 2: Change port in vite.config.js
server: { port: 3001 }
```

#### 4. Face-API Models Not Loading
```
Error loading models from CDN
```

**Solution:**
- Check internet connection
- Models load from: `https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/`
- Wait 10-15 seconds on first load
- Check browser console for specific errors

**Alternative - Use Local Models:**
```bash
cd frontend/public
mkdir models
# Download models from: https://github.com/justadudewhohacks/face-api.js/tree/master/weights
```

Then update `FaceMatchStep.jsx`:
```javascript
const MODEL_URL = '/models';
```

#### 5. React Router Not Working
```
Cannot GET /kyc
```

**Solution:**
Ensure Vite dev server is running with proper routing:
```javascript
// vite.config.js already configured with proxy
```

---

### Backend Issues

#### 1. MongoDB Connection Failed
```
MongooseServerSelectionError: connect ECONNREFUSED
```

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Alternative - Use MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kyc
```

#### 2. Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

#### 3. Multer Upload Error
```
Error: ENOENT: no such file or directory, open 'uploads/...'
```

**Solution:**
```bash
cd backend
mkdir uploads
```

The server should create this automatically, but if not:
```javascript
// Already in server.js
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
```

#### 4. Tesseract.js OCR Fails
```
OCR processing failed
```

**Solutions:**
- Use clear, high-quality images
- Ensure text is readable
- Check image format (JPG, PNG supported)
- Try client-side OCR fallback (automatic)

**Test with sample ID:**
- Create a simple image with text
- Use online ID card generators for testing

#### 5. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
Already configured in `server.js`:
```javascript
app.use(cors());
```

If still having issues:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

### Blockchain Issues

#### 1. Transaction Failed
```
Error: insufficient funds for gas
```

**Solution:**
- Get test MATIC from faucet: https://faucet.polygon.technology/
- Ensure wallet has at least 0.1 MATIC
- Check network is Polygon Mumbai

#### 2. Contract Not Deployed
```
Error: contract not deployed
```

**Solution:**
Deploy using Remix:
1. Go to https://remix.ethereum.org/
2. Create `KYCVerification.sol`
3. Paste contract code
4. Compile (Solidity 0.8.0+)
5. Connect MetaMask to Mumbai
6. Deploy
7. Copy address to `.env`

#### 3. Wrong Network
```
Error: network mismatch
```

**Solution:**
- Switch MetaMask to Polygon Mumbai
- Network details:
  - RPC: https://rpc-mumbai.maticvigil.com
  - Chain ID: 80001
  - Symbol: MATIC

#### 4. Private Key Error
```
Error: invalid private key
```

**Solution:**
- Export private key from MetaMask
- Add to `.env` WITHOUT `0x` prefix
- Keep it secret!

**Demo Mode:**
System works without blockchain - transactions will be mocked with `demo_tx_` prefix

---

### Database Issues

#### 1. User Not Found
```
Error: User not found
```

**Solution:**
- Login first to create user
- Check MongoDB connection
- Verify userId is correct

#### 2. Duplicate Key Error
```
E11000 duplicate key error
```

**Solution:**
- Email or govtId already exists
- Use different credentials
- Or drop collection to reset:
```bash
mongosh
use kyc-verification
db.users.drop()
```

---

### Image Processing Issues

#### 1. No Face Detected
```
Could not detect faces in one or both images
```

**Solutions:**
- Use clear, front-facing photos
- Ensure good lighting
- Face should be clearly visible
- No sunglasses or masks
- Try different images

**Tips for best results:**
- Resolution: 640x480 or higher
- Format: JPG or PNG
- Face size: At least 100x100 pixels
- Lighting: Even, no harsh shadows

#### 2. Low Match Score
```
Face match score < 60%
```

**Reasons:**
- Different angles
- Different lighting
- Time gap between photos
- Facial expressions
- Image quality

**Solutions:**
- Use similar angles
- Similar lighting conditions
- Recent photos
- Neutral expressions

#### 3. OCR Extracts Wrong Data
```
Extracted name/ID incorrect
```

**Solutions:**
- Use clearer images
- Ensure text is horizontal
- No glare or shadows
- High contrast
- Standard fonts

**Manual override:**
System allows manual correction in future versions

---

### Installation Issues

#### 1. npm install Fails
```
Error: EACCES permission denied
```

**Solution:**
```bash
# Windows (Run as Administrator)
npm install

# Mac/Linux
sudo npm install
# Or fix npm permissions
```

#### 2. Node Version Mismatch
```
Error: Unsupported engine
```

**Solution:**
```bash
# Check version
node --version

# Should be 16+
# Update Node.js from nodejs.org
```

#### 3. Canvas Installation Fails (Backend)
```
Error: node-gyp rebuild failed
```

**Solution:**
```bash
# Windows
npm install --global windows-build-tools

# Mac
xcode-select --install

# Linux
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
```

**Alternative:**
Canvas is optional - system works without it

---

### Performance Issues

#### 1. Slow OCR Processing
**Solutions:**
- Use smaller images (resize to 1024px width)
- Backend OCR is faster than client-side
- Be patient (5-10 seconds normal)

#### 2. Slow Face Matching
**Solutions:**
- First load takes longer (model download)
- Subsequent loads are faster (cached)
- Use smaller images
- Close other browser tabs

#### 3. Slow Page Load
**Solutions:**
- Check internet connection
- Clear browser cache
- Disable browser extensions
- Use production build

---

### Development Issues

#### 1. Hot Reload Not Working
**Solution:**
```bash
# Restart Vite dev server
# Ctrl+C then npm run dev
```

#### 2. Changes Not Reflecting
**Solutions:**
- Hard refresh: Ctrl+Shift+R
- Clear browser cache
- Check file is saved
- Restart dev server

#### 3. ESLint Errors
**Solution:**
```bash
# Disable if needed
# Create .eslintignore
node_modules
dist
build
```

---

## Quick Fixes

### Reset Everything
```bash
# Stop all servers
# Ctrl+C in all terminals

# Clean install
cd frontend
rm -rf node_modules package-lock.json
npm install

cd ../backend
rm -rf node_modules package-lock.json
npm install

# Restart MongoDB
mongod

# Start fresh
cd backend && npm start
cd frontend && npm run dev
```

### Clear Database
```bash
mongosh
use kyc-verification
db.dropDatabase()
```

### Check System Health
```bash
# Backend health
curl http://localhost:5000/api/health

# MongoDB
mongosh --eval "db.adminCommand('ping')"

# Frontend
# Open http://localhost:3000
```

---

## Getting Help

1. **Check Logs:**
   - Browser console (F12)
   - Backend terminal
   - MongoDB logs

2. **Verify Setup:**
   - All dependencies installed
   - Environment variables set
   - Services running

3. **Test Components:**
   - Test each step individually
   - Use sample data
   - Check API responses

4. **Documentation:**
   - README.md
   - COMPLETE_SETUP.md
   - FACE_API_SETUP.md
   - TESSERACT_SETUP.md

---

## Still Having Issues?

1. Check all environment variables
2. Verify all services are running
3. Review error messages carefully
4. Test with sample data
5. Try demo mode (without blockchain)

**Most issues are due to:**
- Missing dependencies
- Services not running
- Wrong environment variables
- Network/firewall issues
