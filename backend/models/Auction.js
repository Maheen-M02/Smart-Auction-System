import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  currentBid: { type: Number, required: true },
  highestBidder: { type: String }, // User ID
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  extensionTime: { type: Number, default: 5 }, // minutes
  maxExtensions: { type: Number, default: 3 },
  extensionsCount: { type: Number, default: 0 },
  createdBy: { type: String, required: true }, // User ID
  marketplaceType: { type: String, enum: ['private', 'government'], default: 'private' }
}, { timestamps: true });

export default mongoose.model('Auction', auctionSchema);
