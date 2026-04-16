import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function AuctionList({ user }) {
  const [auctions, setAuctions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', basePrice: '', duration: ''
  });

  useEffect(() => {
    fetchAuctions();

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
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/auction/all');
      setAuctions(data);
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
        userId: user._id
      });
      setShowModal(false);
      setFormData({ title: '', description: '', basePrice: '', duration: '' });
    } catch (error) {
      alert('Error creating auction: ' + error.message);
    }
  };

  const getTimeLeft = (endTime) => {
    const diff = new Date(endTime) - Date.now();
    if (diff <= 0) return 'Ended';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Active Auctions</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Create Auction
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map(auction => (
            <Link key={auction._id} to={`/auction/${auction._id}`}>
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-2">{auction.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{auction.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Current Bid:</span>
                    <span className="font-bold text-green-600">${auction.currentBid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Status:</span>
                    <span className={`font-semibold ${auction.status === 'active' ? 'text-blue-600' : 'text-red-600'}`}>
                      {auction.status === 'active' ? getTimeLeft(auction.endTime) : 'Ended'}
                    </span>
                  </div>
                  {auction.highestBidder && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Leading:</span>
                      <span className="text-sm text-gray-800">{auction.highestBidder.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-96">
              <h2 className="text-2xl font-bold mb-4">Create New Auction</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border rounded mb-3"
                  rows="3"
                  required
                />
                <input
                  type="number"
                  placeholder="Base Price ($)"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: e.target.value})}
                  className="w-full p-2 border rounded mb-3"
                  required
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full p-2 border rounded mb-4"
                  required
                />
                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
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

export default AuctionList;
