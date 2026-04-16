import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  auctionId: { type: String, required: true },
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  isAutoBid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Bid', bidSchema);
