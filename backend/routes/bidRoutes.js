import express from "express";
import { mockDB } from "../db/mockDB.js";

const router = express.Router();

// Place Bid
router.post("/bid/place", async (req, res) => {
  try {
    const { auctionId, userId, amount, maxAutoBid } = req.body;
    
    // Verify user is KYC verified
    const user = mockDB.users.findById(userId);
    if (!user || !user.isVerified) {
      return res.status(403).json({ message: 'User must be KYC verified to place bids' });
    }
    
    const auction = mockDB.auctions.findById(auctionId);
    
    if (!auction || auction.status !== "active") {
      return res.status(400).json({ message: "Auction not active" });
    }
    
    if (amount <= auction.currentBid) {
      return res.status(400).json({ message: "Bid must be higher" });
    }
    
    // ⏱️ ANTI-SNIPING MECHANISM
    const timeLeft = new Date(auction.endTime) - Date.now();
    const SNIPE_THRESHOLD = auction.extensionTime * 60 * 1000;
    const EXTENSION_TIME = auction.extensionTime * 60 * 1000;
    const MAX_EXTENSIONS = auction.maxExtensions;
    
    if (timeLeft < SNIPE_THRESHOLD && timeLeft > 0 && auction.extensionsCount < MAX_EXTENSIONS) {
      auction.endTime = new Date(new Date(auction.endTime).getTime() + EXTENSION_TIME);
      auction.extensionsCount += 1;
      mockDB.auctions.update(auction._id, auction);
      
      // Emit socket event for extension
      const io = req.app.get('io');
      if (io) {
        io.emit('auctionExtended', { 
          auctionId, 
          newEndTime: auction.endTime,
          extensionsCount: auction.extensionsCount,
          maxExtensions: auction.maxExtensions
        });
      }
    }
    
    // 🔽 STORE AUTO-BID (if provided)
    if (maxAutoBid) {
      const existingAutoBid = mockDB.autoBids.findOne({ auctionId, userId });
      if (existingAutoBid) {
        mockDB.autoBids.update({ auctionId, userId }, { maxAmount: maxAutoBid });
      } else {
        mockDB.autoBids.create({ auctionId, userId, maxAmount: maxAutoBid, currentAmount: 0 });
      }
    }
    
    // Create Manual Bid
    const bid = mockDB.bids.create({
      auction: auctionId,
      userId,
      amount,
      isAutoBid: false
    });
    
    // Update Auction
    auction.currentBid = amount;
    auction.highestBidder = userId;
    mockDB.auctions.update(auction._id, auction);
    
    // Emit socket event for manual bid
    const io = req.app.get('io');
    if (io) {
      const bidUser = mockDB.users.findById(userId);
      const populatedBid = {
        ...bid,
        userId: { _id: bidUser._id, name: bidUser.name, email: bidUser.email }
      };
      
      const highestBidder = mockDB.users.findById(auction.highestBidder);
      const populatedAuction = {
        ...auction,
        highestBidder: highestBidder ? { _id: highestBidder._id, name: highestBidder.name, email: highestBidder.email } : null
      };
      
      io.emit('newBid', { auctionId, bid: populatedBid, auction: populatedAuction });
    }
    
    // 🤖 AUTO-BID ENGINE (CORE LOGIC)
    const increment = 100;
    let autoBids = mockDB.autoBids.find({ auctionId }).sort((a, b) => b.maxAmount - a.maxAmount);
    let highest = auction.currentBid;
    
    for (let auto of autoBids) {
      // Skip if this user is already the highest bidder
      if (auto.userId === auction.highestBidder) continue;
      
      // Check if this auto-bidder can outbid current highest
      if (auto.maxAmount > highest) {
        let newAmount = Math.min(highest + increment, auto.maxAmount);
        
        // Create auto-bid
        const autoBid = mockDB.bids.create({
          auction: auctionId,
          userId: auto.userId,
          amount: newAmount,
          isAutoBid: true
        });
        
        // Update highest and auction
        highest = newAmount;
        auction.currentBid = newAmount;
        auction.highestBidder = auto.userId;
        mockDB.auctions.update(auction._id, auction);
        
        // Emit socket event for auto-bid
        if (io) {
          const autoBidUser = mockDB.users.findById(auto.userId);
          const populatedAutoBid = {
            ...autoBid,
            userId: { _id: autoBidUser._id, name: autoBidUser.name, email: autoBidUser.email }
          };
          
          const highestBidder = mockDB.users.findById(auction.highestBidder);
          const populatedAuction = {
            ...auction,
            highestBidder: highestBidder ? { _id: highestBidder._id, name: highestBidder.name, email: highestBidder.email } : null
          };
          
          io.emit('autoBidPlaced', { auctionId, bid: populatedAutoBid, auction: populatedAuction });
        }
      }
    }
    
    // Return final state
    const finalAuction = mockDB.auctions.findById(auctionId);
    const highestBidder = finalAuction.highestBidder ? mockDB.users.findById(finalAuction.highestBidder) : null;
    
    const populatedFinalAuction = {
      ...finalAuction,
      highestBidder: highestBidder ? { _id: highestBidder._id, name: highestBidder.name, email: highestBidder.email } : null
    };
    
    res.json({ bid, auction: populatedFinalAuction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
