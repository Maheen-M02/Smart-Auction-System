import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  userType: {
    type: String,
    enum: ['bidder', 'auctionLister'],
    required: true
  },
  isVerified: { type: Boolean, default: false },
  kycCompleted: { type: Boolean, default: false },
  kycData: {
    extractedName: String,
    idNumber: String,
    faceMatchScore: Number,
    kycHash: String,
    blockchainTxHash: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending'
    },
    idImagePath: String,
    selfieImagePath: String
  },
  bidderProfile: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    preferredCategories: [String]
  },
  listerProfile: {
    businessName: String,
    businessAddress: String,
    businessLicense: String,
    taxId: String
  },
  // Auction-related fields
  totalWins: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  marketplaceType: {
    type: String,
    enum: ['private', 'government'],
    default: 'private'
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
