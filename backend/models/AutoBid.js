import mongoose from 'mongoose';

const autoBidSchema = new mongoose.Schema({
  auctionId: { type: String, required: true },
  userId: { type: String, required: true },
  maxAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('AutoBid', autoBidSchema);
