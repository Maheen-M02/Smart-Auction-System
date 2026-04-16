import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import AuctionCard from '../components/AuctionCard';

const socket = io('http://localhost:5000');

function BidderDashboard() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [filter, setFilter] = useState('all'); // all, active, ended
  const [walletBalance, setWalletBalance] = useState(50000); // Mock wallet balance
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  
  // Get user data from localStorage
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const marketplaceType = localStorage.getItem('marketplaceType');

  useEffect(() => {
    // Check if user is logged in
    if (!userId) {
      navigate('/login');
      return;
    }

    fetchAuctions();
    
    // Load wallet balance from localStorage
    const savedBalance = localStorage.getItem('walletBalance');
    if (savedBalance) {
      setWalletBalance(Number(savedBalance));
    }
    
    // Load anonymous mode from localStorage
    const savedAnonymous = localStorage.getItem('isAnonymous');
    if (savedAnonymous) {
      setIsAnonymous(savedAnonymous === 'true');
    }

    socket.on('auctionCreated', (auction) => {
      setAuctions(prev => [auction, ...prev]);
    });

    socket.on('newBid', ({ auctionId, auction }) => {
      setAuctions(prev => prev.map(a => a._id === auctionId ? auction : a));
    });

    socket.on('auctionEnded', ({ auctionId, auction }) => {
      setAuctions(prev => prev.map(a => a._id === auctionId ? auction : a));
    });

    return () => {
      socket.off('auctionCreated');
      socket.off('newBid');
      socket.off('auctionEnded');
    };
  }, [userId, navigate]);

  const fetchAuctions = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auction/all');
      setAuctions(data);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleTopUp = () => {
    const amount = 10000;
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    localStorage.setItem('walletBalance', newBalance.toString());
  };

  const handleCustomTopUp = () => {
    if (!customAmount || Number(customAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    const amount = Number(customAmount);
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    localStorage.setItem('walletBalance', newBalance.toString());
    setCustomAmount('');
  };

  const handleQuickAdd = (amount) => {
    const newBalance = walletBalance + amount;
    setWalletBalance(newBalance);
    localStorage.setItem('walletBalance', newBalance.toString());
  };

  const toggleAnonymous = () => {
    const newValue = !isAnonymous;
    setIsAnonymous(newValue);
    localStorage.setItem('isAnonymous', newValue.toString());
  };

  const filteredAuctions = auctions.filter(auction => {
    if (filter === 'active') return auction.status === 'active';
    if (filter === 'ended') return auction.status === 'ended';
    return true;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">💰 Bidder Dashboard</h1>
              <p className="text-blue-100">
                Welcome, {userName}! • {marketplaceType === 'private' ? '🏢 Private' : '🏛️ Government'} Marketplace
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 font-semibold shadow-md transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Wallet & Settings Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Wallet Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm uppercase tracking-wide opacity-90">Wallet Balance</p>
                <p className="text-4xl font-bold mt-2">${walletBalance.toLocaleString()}</p>
              </div>
              <div className="text-4xl">💳</div>
            </div>
            
            {/* Custom Amount Input */}
            <div className="mb-3">
              <label className="block text-sm text-green-100 mb-2">Add Custom Amount</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 p-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                  min="1"
                />
                <button
                  onClick={handleCustomTopUp}
                  className="bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 font-semibold transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div className="mb-3">
              <p className="text-sm text-green-100 mb-2">Quick Add</p>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleQuickAdd(1)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  +$1
                </button>
                <button
                  onClick={() => handleQuickAdd(10)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  +$10
                </button>
                <button
                  onClick={() => handleQuickAdd(100)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  +$100
                </button>
                <button
                  onClick={() => handleQuickAdd(1000)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  +$1K
                </button>
              </div>
            </div>

            <p className="text-xs text-green-100 text-center">
              Mock wallet for simulation purposes
            </p>
          </div>

          {/* Anonymous Mode Card */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Anonymous Mode</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Hide your identity in auction rooms
                </p>
              </div>
              <div className="text-4xl">🎭</div>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">
                {isAnonymous ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={toggleAnonymous}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                  isAnonymous ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isAnonymous ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {isAnonymous && (
              <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-800">
                  ✓ Your name will appear as "Bidder{user._id.slice(-3)}" in auctions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Auctions</p>
            <p className="text-3xl font-bold text-blue-600">{auctions.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Active Auctions</p>
            <p className="text-3xl font-bold text-green-600">
              {auctions.filter(a => a.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Ended Auctions</p>
            <p className="text-3xl font-bold text-red-600">
              {auctions.filter(a => a.status === 'ended').length}
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Auctions</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('ended')}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === 'ended' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Ended
            </button>
          </div>
        </div>

        {/* Auctions Grid */}
        {filteredAuctions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No auctions found</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter !== 'all' ? 'Try changing the filter' : 'Check back later for new auctions'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map(auction => (
              <AuctionCard key={auction._id} auction={auction} showCreator={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BidderDashboard;
