# ⚡ Quick Start - 3 Minutes to Running System

## Prerequisites Check
- [ ] Node.js installed (v16+)
- [ ] MongoDB installed OR MongoDB Atlas account
- [ ] Git installed

## Step 1: Install (1 minute)

```bash
# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

## Step 2: Configure (30 seconds)

The `.env` file is already created in `backend/.env` with default values.

**For local MongoDB:** No changes needed!

**For MongoDB Atlas:**
1. Get your connection string from Atlas
2. Edit `backend/.env`
3. Replace `MONGODB_URI` value

## Step 3: Start (30 seconds)

### Windows:
```bash
# Double-click start.bat
# OR run in terminal:
start.bat
```

### Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

### Manual Start:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Step 4: Test (1 minute)

1. Open http://localhost:3000
2. Enter Government ID: `ABCDE1234F`
3. Click "Login / Register"
4. Upload any ID image
5. Upload any selfie
6. Watch the magic happen! ✨

## 🎉 That's It!

You now have a fully functional KYC system with:
- ✅ Government ID authentication
- ✅ OCR text extraction
- ✅ AI face matching
- ✅ Blockchain-ready verification

## Next Steps

1. **Test with real images** - Use actual ID cards for better OCR
2. **Deploy smart contract** - See SETUP_GUIDE.md for blockchain setup
3. **Integrate with auction** - See INTEGRATION_EXAMPLE.md
4. **Customize UI** - Edit Tailwind config for your brand

## Troubleshooting

**Port already in use?**
- Change PORT in `backend/.env`

**MongoDB connection failed?**
- Check MongoDB is running: `mongod`
- Or use MongoDB Atlas (free tier)

**Face-api models not loading?**
- Check internet connection
- Wait a few seconds on first load

## 📚 Documentation

- **README.md** - Complete documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **TEST_GUIDE.md** - Testing workflows
- **ARCHITECTURE.md** - System architecture
- **INTEGRATION_EXAMPLE.md** - Auction integration

## 🆘 Need Help?

Check the documentation files or open an issue on GitHub.

---

**Happy coding! 🚀**
