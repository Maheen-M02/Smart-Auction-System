import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import kycRoutes from './routes/kyc.js';
import auctionRoutes from './routes/auctionRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import { mockDB } from './db/mockDB.js';
import fs from 'fs';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { 
    origin: ['http://localhost:3000', 'http://localhost:3070'], 
    credentials: true 
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Make io accessible to routes
app.set('io', io);

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api', auctionRoutes);
app.use('/api', bidRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BidBazaar Backend Running (Unified System)' });
});

// Background job to end auctions and update winners
setInterval(async () => {
  try {
    const allAuctions = mockDB.auctions.findAll();
    const expiredAuctions = allAuctions.filter(auction => 
      auction.status === 'active' && new Date(auction.endTime) <= new Date()
    );

    for (const auction of expiredAuctions) {
      auction.status = 'ended';
      mockDB.auctions.update(auction._id, auction);

      if (auction.highestBidder) {
        const user = mockDB.users.findById(auction.highestBidder);
        if (user) {
          user.totalWins = (user.totalWins || 0) + 1;
          user.totalSpent = (user.totalSpent || 0) + auction.currentBid;
          mockDB.users.update(user._id, user);
        }
      }

      io.emit('auctionEnded', { auctionId: auction._id, auction });
    }

    if (expiredAuctions.length > 0) {
      const leaderboard = mockDB.users.find().sort({ totalWins: -1, totalSpent: -1 }).limit(10);
      io.emit('leaderboardUpdate', leaderboard);
    }
  } catch (error) {
    console.error('Error ending auctions:', error);
  }
}, 1000);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 BidBazaar Unified Backend running on port ${PORT}`);
  console.log('📦 Using in-memory mock database');
  console.log('🔌 Socket.io enabled for real-time features');
  console.log('✅ Ready to accept requests');
  console.log('');
  console.log('Available services:');
  console.log('  - KYC Verification');
  console.log('  - User Authentication');
  console.log('  - Auction Management');
  console.log('  - Real-time Bidding');
});
