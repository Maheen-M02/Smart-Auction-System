import express from 'express';
import multer from 'multer';
import { mockDB } from '../db/mockDB.js';
import { extractTextFromImage } from '../utils/ocr.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// POST /auth/register - Upload ID + Selfie
router.post('/register', upload.fields([
  { name: 'idImage', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userType, name, email, phone } = req.body;
    
    if (!req.files.idImage || !req.files.selfie) {
      return res.status(400).json({ error: 'Both ID image and selfie are required' });
    }
    
    if (!userType || !['bidder', 'auctionLister'].includes(userType)) {
      return res.status(400).json({ error: 'Valid user type required (bidder or auctionLister)' });
    }
    
    const idImagePath = req.files.idImage[0].path;
    const selfiePath = req.files.selfie[0].path;
    
    let ocrData;
    try {
      ocrData = await extractTextFromImage(idImagePath);
    } catch (ocrError) {
      console.error('OCR failed:', ocrError);
      ocrData = {
        extractedName: name || 'Unknown',
        idNumber: 'ID_' + Date.now()
      };
    }
    
    const tempUserId = 'temp_' + Date.now();
    
    res.json({
      success: true,
      tempUserId,
      idImagePath,
      selfiePath,
      ocrData,
      message: 'Images uploaded. Proceed to face matching.'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /auth/verify-and-login - Complete registration after face match
router.post('/verify-and-login', async (req, res) => {
  try {
    const { 
      tempUserId, 
      faceMatchScore, 
      userType, 
      name, 
      email, 
      phone,
      idImagePath,
      selfiePath,
      ocrData
    } = req.body;
    
    console.log('Verify and login request:', { email, userType, faceMatchScore });
    
    if (!faceMatchScore || faceMatchScore < 0.6) {
      return res.status(400).json({ 
        error: 'Face verification failed. Match score too low.',
        faceMatchScore 
      });
    }
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    if (!userType || !['bidder', 'auctionLister'].includes(userType)) {
      return res.status(400).json({ error: 'Valid user type required (bidder or auctionLister)' });
    }
    
    // Check if user already exists
    const existingUser = mockDB.users.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists, returning existing user:', email);
      // Return existing user instead of error
      return res.json({
        success: true,
        userId: existingUser._id,
        userType: existingUser.userType,
        isVerified: existingUser.isVerified,
        message: 'User already registered',
        redirectTo: '/marketplace'
      });
    }
    
    // Create new user
    const user = mockDB.users.create({
      name: name || ocrData?.extractedName || 'User',
      email,
      phone: phone || '',
      userType,
      isVerified: true,
      kycCompleted: true,
      kycData: {
        extractedName: ocrData?.extractedName || name,
        idNumber: ocrData?.idNumber || 'ID_' + Date.now(),
        faceMatchScore,
        verificationStatus: 'verified',
        idImagePath: idImagePath || '',
        selfieImagePath: selfiePath || ''
      },
      bidderProfile: userType === 'bidder' ? {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        preferredCategories: []
      } : undefined,
      listerProfile: userType === 'auctionLister' ? {
        businessName: '',
        businessAddress: '',
        businessLicense: '',
        taxId: ''
      } : undefined
    });
    
    console.log('✅ User registered:', user.email, '- Type:', user.userType);
    
    res.json({
      success: true,
      userId: user._id,
      userType: user.userType,
      isVerified: true,
      message: 'Registration and verification successful',
      redirectTo: '/marketplace'
    });
    
  } catch (error) {
    console.error('Verify and login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /auth/login - Simple login for existing users
router.post('/login', async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone required' });
    }
    
    const query = email ? { email } : { phone };
    const user = mockDB.users.findOne(query);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found. Please register first.',
        needsRegistration: true
      });
    }
    
    console.log('✅ User logged in:', user.email);
    
    res.json({
      success: true,
      userId: user._id,
      userType: user.userType,
      isVerified: user.isVerified,
      kycCompleted: user.kycCompleted,
      name: user.name,
      redirectTo: user.isVerified ? '/dashboard' : '/register'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /auth/user/:userId
router.get('/user/:userId', async (req, res) => {
  try {
    const user = mockDB.users.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      isVerified: user.isVerified,
      kycCompleted: user.kycCompleted,
      kycData: user.kycData,
      bidderProfile: user.bidderProfile,
      listerProfile: user.listerProfile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /auth/users - Get all users (for testing)
router.get('/users', (req, res) => {
  const users = mockDB.users.findAll();
  res.json({
    count: users.length,
    users: users.map(u => ({
      userId: u._id,
      name: u.name,
      email: u.email,
      userType: u.userType,
      isVerified: u.isVerified
    }))
  });
});

export default router;
