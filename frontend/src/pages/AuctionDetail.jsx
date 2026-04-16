import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function AuctionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidAmount, setBidAmount] = useState('');
  const [maxAutoBid, setMaxAutoBid] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('info'); // info, success, warning, danger
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Get user data from localStorage
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    // Check if user is logged in
    if (!userId) {
      navigate('/login');
      return;
    }

    // Load anonymous mode from localStorage
    const savedAnonymous = localStorage.getItem('isAnonymous');
    if (savedAnonymous) {
      setIsAnonymous(savedAnonymous === 'true');
    }
  }, [userId, navigate]);

  useEffect(() => {
    fetchAuctionDetails();

    socket.on('newBid', ({ auctionId, bid, auction: updatedAuction }) => {
      if (auctionId === id) {
        setAuction(updatedAuction);
        setBids(prev => [bid, ...prev]);
        
        // Notification if user got outbid
        const highestBidderId = auction?.highestBidder?._id || auction?.highestBidder;
        const bidUserId = bid.userId?._id || bid.userId;
        
        if (highestBidderId === userId && bidUserId !== userId) {
          showNotification('You have been outbid! 😱', 'warning');
        } else if (bidUserId === userId) {
          showNotification('Your bid was placed successfully! 🎉', 'success');
        }
      }
    });

    socket.on('autoBidPlaced', ({ auctionId, bid, auction: updatedAuction }) => {
      if (auctionId === id) {
        setAuction(updatedAuction);
        setBids(prev => [bid, ...prev]);
        
        const bidUserId = bid.userId?._id || bid.userId;
        const highestBidderId = auction?.highestBidder?._id || auction?.highestBidder;
        
        if (bidUserId === userId) {
          showNotification('Auto-bid placed on your behalf! 🤖', 'info');
        } else if (highestBidderId === userId) {
          showNotification('You have been outbid by auto-bid! 😱', 'warning');
        }
      }
    });

    socket.on('auctionExtended', ({ auctionId, newEndTime, extensionsCount, maxExtensions }) => {
      if (auctionId === id) {
        setAuction(prev => ({ ...prev, endTime: newEndTime, extensionsCount }));
        showNotification(`⏰ Auction extended! (${extensionsCount}/${maxExtensions})`, 'info');
      }
    });

    socket.on('auctionEnded', ({ auctionId, auction: endedAuction }) => {
      if (auctionId === id) {
        setAuction(endedAuction);
        const winnerId = endedAuction.highestBidder?._id || endedAuction.highestBidder;
        if (winnerId === userId) {
          showNotification('🎊 Congratulations! You won the auction!', 'success');
        } else {
          showNotification('Auction has ended', 'info');
        }
      }
    });

    return () => {
      socket.off('newBid');
      socket.off('autoBidPlaced');
      socket.off('auctionExtended');
      socket.off('auctionEnded');
    };
  }, [id, userId, auction?.highestBidder]);

  useEffect(() => {
    if (!auction) return;

    const timer = setInterval(() => {
      const diff = new Date(auction.endTime) - Date.now();
      if (diff <= 0) {
        setTimeLeft('Ended');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const fetchAuctionDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/auction/${id}`);
      setAuction(data.auction);
      setBids(data.bids);
    } catch (error) {
      console.error('Error fetching auction:', error);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(''), 4000);
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    
    if (!bidAmount || Number(bidAmount) <= auction.currentBid) {
      showNotification('Bid must be higher than current bid!', 'danger');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/bid/place', {
        auctionId: id,
        userId: userId,
        amount: Number(bidAmount),
        maxAutoBid: maxAutoBid ? Number(maxAutoBid) : undefined
      });
      setBidAmount('');
      setMaxAutoBid('');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error placing bid', 'danger');
    }
  };

  const maskBidderName = (name, bidderUserId) => {
    if (bidderUserId === userId) return 'You';
    if (isAnonymous) {
      const hash = bidderUserId?.slice(-3) || '000';
      return `Bidder${hash}`;
    }
    return name;
  };

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading auction...</div>
      </div>
    );
  }

  const highestBidderId = auction.highestBidder?._id || auction.highestBidder;
  const isHighestBidder = highestBidderId === userId;
  const isAuctionActive = auction.status === 'active';
  // Check if user is the creator - handle both populated and non-populated createdBy
  // If createdBy doesn't exist, allow bidding (assume user is not creator)
  const creatorId = auction.createdBy 
    ? (typeof auction.createdBy === 'object' ? auction.createdBy._id : auction.createdBy)
    : null;
  const isCreator = creatorId && (creatorId.toString() === userId.toString());

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Notification */}
        {notification && (
          <div className={`fixed top-20 right-4 z-50 animate-pulse ${
            notificationType === 'success' ? 'bg-green-600' :
            notificationType === 'warning' ? 'bg-yellow-600' :
            notificationType === 'danger' ? 'bg-red-600' :
            'bg-blue-600'
          } text-white px-6 py-4 rounded-lg shadow-2xl`}>
            <p className="font-semibold">{notification}</p>
          </div>
        )}

        {/* Back Button */}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mb-4 text-blue-400 hover:text-blue-300 flex items-center"
        >
          ← Back to Dashboard
        </button>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Auction Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Auction Details</h2>
              <h1 className="text-3xl font-bold mb-4">{auction.title}</h1>
              <p className="text-gray-300 mb-6">{auction.description}</p>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Base Price</span>
                  <span className="font-semibold">${auction.basePrice}</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className={`font-semibold px-3 py-1 rounded ${
                    isAuctionActive ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    {auction.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Extensions</span>
                  <span className="font-semibold">
                    {auction.extensionsCount || 0} / {auction.maxExtensions || 3}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Bids</span>
                  <span className="font-semibold">{bids.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Current Bid + Timer + Bid Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Bid Display */}
            <div className={`rounded-lg p-8 shadow-2xl text-center ${
              isHighestBidder ? 'bg-gradient-to-br from-green-600 to-green-800' : 'bg-gradient-to-br from-blue-600 to-purple-600'
            }`}>
              <p className="text-sm uppercase tracking-wide mb-2">Current Highest Bid</p>
              <p className="text-6xl font-bold mb-4">${auction.currentBid}</p>
              
              {auction.highestBidder && (
                <div className="mb-4">
                  <p className="text-sm mb-1">Leading Bidder</p>
                  <p className="text-2xl font-bold">
                    {maskBidderName(auction.highestBidder.name, auction.highestBidder._id)}
                  </p>
                  {isHighestBidder && (
                    <p className="text-sm mt-2 bg-white bg-opacity-20 rounded px-3 py-1 inline-block">
                      🎉 You're winning!
                    </p>
                  )}
                </div>
              )}
              
              {/* Countdown Timer */}
              <div className="mt-6 pt-6 border-t border-white border-opacity-30">
                <p className="text-sm uppercase tracking-wide mb-2">Time Remaining</p>
                <p className={`text-4xl font-bold ${
                  auction.status === 'ended' ? 'text-red-300' : 'text-white'
                }`}>
                  {timeLeft}
                </p>
              </div>
            </div>

            {/* Bid Form */}
            {isAuctionActive && !isCreator && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                <h3 className="text-xl font-bold mb-4 text-blue-400">Place Your Bid</h3>
                <form onSubmit={handlePlaceBid} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Bid Amount ($)
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={auction.currentBid + 1}
                      placeholder={`Min: $${auction.currentBid + 1}`}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Max Auto-Bid (Optional) 🤖
                    </label>
                    <input
                      type="number"
                      value={maxAutoBid}
                      onChange={(e) => setMaxAutoBid(e.target.value)}
                      placeholder="System will auto-bid up to this amount"
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Auto-bid will place bids on your behalf up to your max amount
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-lg transition"
                  >
                    Place Bid
                  </button>
                </form>
              </div>
            )}

            {isAuctionActive && isCreator && (
              <div className="bg-yellow-900 bg-opacity-50 rounded-lg p-6 text-center">
                <p className="text-xl font-bold mb-2">👨‍💼 Auction Creator</p>
                <p className="text-gray-300">
                  You cannot bid on your own auction
                </p>
              </div>
            )}

            {!isAuctionActive && (
              <div className="bg-red-900 bg-opacity-50 rounded-lg p-6 text-center">
                <p className="text-xl font-bold mb-2">Auction Ended</p>
                {auction.highestBidder && (
                  <p className="text-gray-300">
                    Winner: {maskBidderName(auction.highestBidder.name, auction.highestBidder._id)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Bid History */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-blue-400">Bid History</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                {bids.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No bids yet. Be the first!</p>
                ) : (
                  bids.map((bid, index) => {
                    const isBidder = bid.userId._id === user._id;
                    const isTopBid = index === 0;
                    
                    return (
                      <div
                        key={bid._id}
                        className={`p-4 rounded-lg transition ${
                          isTopBid 
                            ? 'bg-gradient-to-r from-green-600 to-green-700 shadow-lg' 
                            : isBidder
                            ? 'bg-blue-900 bg-opacity-50'
                            : 'bg-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold">
                              {maskBidderName(bid.userId.name, bid.userId._id)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(bid.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">${bid.amount}</p>
                            {bid.isAutoBid && (
                              <span className="text-xs bg-purple-600 px-2 py-1 rounded">
                                🤖 Auto
                              </span>
                            )}
                          </div>
                        </div>
                        {isTopBid && (
                          <p className="text-xs bg-white bg-opacity-20 rounded px-2 py-1 inline-block">
                            👑 Highest Bid
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}

export default AuctionDetail;
