import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import AuctionCard from '../components/AuctionCard';

const socket = io('http://localhost:5000');

function CreatorDashboard() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', basePrice: '', duration: ''
  });
  
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

    socket.on('auctionCreated', (auction) => {
      if (auction.createdBy === userId) {
        setAuctions(prev => [auction, ...prev]);
      }
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
      // Filter to show only auctions created by this user
      const myAuctions = data.filter(a => a.createdBy?._id === userId || a.createdBy === userId);
      setAuctions(myAuctions);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auction/create', {
        ...formData,
        basePrice: Number(formData.basePrice),
        duration: Number(formData.duration),
        userId: userId,
        marketplaceType: marketplaceType || 'private'
      });
      setShowModal(false);
      setFormData({ title: '', description: '', basePrice: '', duration: '' });
      fetchAuctions();
    } catch (error) {
      alert('Error creating auction: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 mb-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">🎨 Creator Dashboard</h1>
              <p className="text-purple-100">
                Welcome, {userName}! • {marketplaceType === 'private' ? '🏢 Private' : '🏛️ Government'} Marketplace
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 font-semibold shadow-md transition"
              >
                + Create New Auction
              </button>
              <button
                onClick={handleLogout}
                className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 font-semibold shadow-md transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Auctions</p>
            <p className="text-3xl font-bold text-purple-600">{auctions.length}</p>
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

        {/* My Auctions Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Auctions</h2>
        </div>

        {auctions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg mb-4">You haven't created any auctions yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold"
            >
              Create Your First Auction
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map(auction => (
              <AuctionCard key={auction._id} auction={auction} showCreator={false} />
            ))}
          </div>
        )}

        {/* Create Auction Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Auction</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    placeholder="e.g., iPhone 13 Pro"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Description</label>
                  <textarea
                    placeholder="Describe your item..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Base Price ($)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button 
                    type="submit" 
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold"
                  >
                    Create Auction
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreatorDashboard;
