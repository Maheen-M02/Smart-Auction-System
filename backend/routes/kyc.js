import express from 'express';
import multer from 'multer';
import { mockDB } from '../db/mockDB.js';
import { extractTextFromImage } from '../utils/ocr.js';
import { generateKYCHash } from '../utils/blockchain.js';

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

// POST /kyc/upload - Upload ID and selfie
router.post('/upload', upload.fields([
  { name: 'idImage', maxCount: 1 },
  { name: 'selfie', maxCount: 1 }
]), async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!req.files.idImage || !req.files.selfie) {
      return res.status(400).json({ error: 'Both ID image and selfie are required' });
    }
    
    const idImagePath = req.files.idImage[0].path;
    const selfiePath = req.files.selfie[0].path;
    
    const user = mockDB.users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.kycData = {
      ...user.kycData,
      idImagePath,
      selfieImagePath: selfiePath,
      verificationStatus: 'pending'
    };
    
    mockDB.users.update(user._id, user);
    
    res.json({
      success: true,
      userId: user._id,
      idImagePath,
      selfiePath
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /kyc/ocr - Extract text from ID
router.post('/ocr', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = mockDB.users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const ocrData = await extractTextFromImage(user.kycData.idImagePath);
    
    user.kycData.extractedName = ocrData.extractedName;
    user.kycData.idNumber = ocrData.idNumber;
    mockDB.users.update(user._id, user);
    
    res.json({
      success: true,
      extractedName: ocrData.extractedName,
      idNumber: ocrData.idNumber
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /kyc/verify - Verify KYC
router.post('/verify', async (req, res) => {
  try {
    const { userId, faceMatchScore } = req.body;
    
    const user = mockDB.users.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.kycData = user.kycData || {};
    user.kycData.faceMatchScore = faceMatchScore;
    
    if (faceMatchScore > 0.6) {
      user.isVerified = true;
      user.kycCompleted = true;
      user.kycData.verificationStatus = 'verified';
    } else {
      user.kycCompleted = true;
      user.kycData.verificationStatus = 'failed';
    }
    
    const kycHash = generateKYCHash(
      user.kycData.extractedName || user.name,
      user.kycData.idNumber || 'N/A',
      faceMatchScore
    );
    user.kycData.kycHash = kycHash;
    user.kycData.blockchainTxHash = 'demo_tx_' + Date.now();
    
    mockDB.users.update(user._id, user);
    
    res.json({
      success: true,
      isVerified: user.isVerified,
      matchScore: faceMatchScore,
      verificationStatus: user.kycData.verificationStatus,
      blockchainTxHash: user.kycData.blockchainTxHash,
      kycHash
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /kyc/status/:userId - Get verification status
router.get('/status/:userId', async (req, res) => {
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
      isVerified: user.isVerified || false,
      kycCompleted: user.kycCompleted || false,
      verificationStatus: user.kycData?.verificationStatus || 'pending',
      faceMatchScore: user.kycData?.faceMatchScore || 0,
      blockchainTxHash: user.kycData?.blockchainTxHash || '',
      extractedName: user.kycData?.extractedName || user.name,
      idNumber: user.kycData?.idNumber || '',
      totalWins: user.totalWins || 0,
      totalSpent: user.totalSpent || 0,
      marketplaceType: user.marketplaceType || 'private'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
