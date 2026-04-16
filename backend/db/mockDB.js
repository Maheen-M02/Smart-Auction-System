// In-memory mock database
let users = [];
let auctions = [];
let bids = [];
let autoBids = [];
let userIdCounter = 1;
let auctionIdCounter = 1;
let bidIdCounter = 1;
let autoBidIdCounter = 1;

export const mockDB = {
  users: {
    // Create a new user
    create: (userData) => {
      const user = {
        _id: `user_${userIdCounter++}`,
        totalWins: 0,
        totalSpent: 0,
        marketplaceType: 'private',
        ...userData,
        createdAt: new Date()
      };
      users.push(user);
      return user;
    },

    // Find user by query
    findOne: (query) => {
      return users.find(user => {
        if (query._id) return user._id === query._id;
        if (query.email) return user.email === query.email;
        if (query.phone) return user.phone === query.phone;
        return false;
      });
    },

    // Find user by ID
    findById: (id) => {
      return users.find(user => user._id === id);
    },

    // Update user
    update: (id, updates) => {
      const index = users.findIndex(user => user._id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return users[index];
      }
      return null;
    },

    // Find by ID and update
    findByIdAndUpdate: (id, updates) => {
      const index = users.findIndex(user => user._id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return users[index];
      }
      return null;
    },

    // Get all users
    findAll: () => {
      return users;
    },

    // Find with sorting and limit
    find: (query = {}) => {
      let results = users;
      return {
        sort: (sortOptions) => ({
          limit: (limitNum) => {
            let sorted = [...results];
            if (sortOptions.totalWins !== undefined) {
              sorted.sort((a, b) => {
                if (sortOptions.totalWins === -1) {
                  return (b.totalWins || 0) - (a.totalWins || 0);
                }
                return (a.totalWins || 0) - (b.totalWins || 0);
              });
            }
            return sorted.slice(0, limitNum);
          }
        })
      };
    },

    // Delete user
    delete: (id) => {
      const index = users.findIndex(user => user._id === id);
      if (index !== -1) {
        users.splice(index, 1);
        return true;
      }
      return false;
    },

    // Clear all users (for testing)
    clear: () => {
      users = [];
      userIdCounter = 1;
    }
  },

  auctions: {
    create: (auctionData) => {
      const auction = {
        _id: `auction_${auctionIdCounter++}`,
        ...auctionData,
        createdAt: new Date()
      };
      auctions.push(auction);
      return auction;
    },

    findById: (id) => {
      return auctions.find(auction => auction._id === id);
    },

    find: (query = {}) => {
      let results = auctions.filter(auction => {
        if (query.status && auction.status !== query.status) return false;
        if (query.endTime && query.endTime.$lte) {
          return new Date(auction.endTime) <= query.endTime.$lte;
        }
        if (query.createdBy && auction.createdBy !== query.createdBy) return false;
        return true;
      });
      
      return {
        sort: (sortOptions) => results,
        exec: () => Promise.resolve(results)
      };
    },

    findAll: () => auctions,

    update: (id, updates) => {
      const index = auctions.findIndex(auction => auction._id === id);
      if (index !== -1) {
        auctions[index] = { ...auctions[index], ...updates };
        return auctions[index];
      }
      return null;
    },

    save: (auction) => {
      const index = auctions.findIndex(a => a._id === auction._id);
      if (index !== -1) {
        auctions[index] = auction;
      }
      return auction;
    }
  },

  bids: {
    create: (bidData) => {
      const bid = {
        _id: `bid_${bidIdCounter++}`,
        ...bidData,
        createdAt: new Date()
      };
      bids.push(bid);
      return bid;
    },

    find: (query = {}) => {
      return bids.filter(bid => {
        if (query.auction && bid.auction !== query.auction) return false;
        return true;
      });
    }
  },

  autoBids: {
    create: (autoBidData) => {
      const autoBid = {
        _id: `autoBid_${autoBidIdCounter++}`,
        ...autoBidData,
        createdAt: new Date()
      };
      autoBids.push(autoBid);
      return autoBid;
    },

    findOne: (query) => {
      return autoBids.find(autoBid => {
        if (query.user && autoBid.user !== query.user) return false;
        if (query.auction && autoBid.auction !== query.auction) return false;
        return true;
      });
    },

    update: (query, updates) => {
      const autoBid = this.findOne(query);
      if (autoBid) {
        Object.assign(autoBid, updates);
        return autoBid;
      }
      return null;
    }
  }
};

// Log database operations
console.log('📦 Mock Database initialized with auction support');

