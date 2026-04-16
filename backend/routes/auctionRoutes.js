import express from "express";
import { mockDB } from "../db/mockDB.js";

const router = express.Router();

// Create Auction
router.post("/auction/create", async (req, res) => {
  try {
    const { title, description, basePrice, duration, userId, extensionTime, maxExtensions, marketplaceType } = req.body;
    
    // Verify user is KYC verified
    const user = mockDB.users.findById(userId);
    if (!user || !user.isVerified) {
      return res.status(403).json({ error: 'User must be KYC verified to create auctions' });
    }
    
    if (user.userType !== 'auctionLister') {
      return res.status(403).json({ error: 'Only auction listers can create auctions' });
    }
    
    const endTime = new Date(Date.now() + duration * 60 * 1000);
    
    const auction = mockDB.auctions.create({
      title,
      description,
      basePrice,
      currentBid: basePrice,
      highestBidder: null,
      endTime,
      extensionTime: extensionTime || 5,
      maxExtensions: maxExtensions || 3,
      extensionsCount: 0,
      createdBy: userId,
      marketplaceType: marketplaceType || 'private',
      status: 'active'
    });
    
    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('auctionCreated', auction);
    }
    
    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all auctions
router.get("/auction/all", async (req, res) => {
  try {
    const auctions = mockDB.auctions.findAll();
    
    // Populate user data
    const populatedAuctions = auctions.map(auction => {
      const highestBidder = auction.highestBidder ? mockDB.users.findById(auction.highestBidder) : null;
      const creator = mockDB.users.findById(auction.createdBy);
      
      return {
        ...auction,
        highestBidder: highestBidder ? { _id: highestBidder._id, name: highestBidder.name, email: highestBidder.email } : null,
        createdBy: creator ? { _id: creator._id, name: creator.name, email: creator.email } : null
      };
    });
    
    res.json(populatedAuctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get auction by ID
router.get("/auction/:id", async (req, res) => {
  try {
    const auction = mockDB.auctions.findById(req.params.id);
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    
    // Populate user data
    const highestBidder = auction.highestBidder ? mockDB.users.findById(auction.highestBidder) : null;
    const creator = mockDB.users.findById(auction.createdBy);
    
    const populatedAuction = {
      ...auction,
      highestBidder: highestBidder ? { _id: highestBidder._id, name: highestBidder.name, email: highestBidder.email } : null,
      createdBy: creator ? { _id: creator._id, name: creator.name, email: creator.email } : null
    };
    
    // Get bids
    const bids = mockDB.bids.find({ auction: req.params.id });
    const populatedBids = bids.map(bid => {
      const user = mockDB.users.findById(bid.userId);
      return {
        ...bid,
        userId: user ? { _id: user._id, name: user.name, email: user.email } : null
      };
    });
    
    res.json({ auction: populatedAuction, bids: populatedBids });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mock login for auction system compatibility
router.post("/login", async (req, res) => {
  try {
    const { email, name } = req.body;
    
    let user = mockDB.users.findOne({ email });
    
    if (!user) {
      // Create user if doesn't exist (for backward compatibility)
      user = mockDB.users.create({ 
        email, 
        name,
        userType: 'bidder',
        isVerified: false,
        kycCompleted: false
      });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const users = mockDB.users.find().sort({ totalWins: -1, totalSpent: -1 }).limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
