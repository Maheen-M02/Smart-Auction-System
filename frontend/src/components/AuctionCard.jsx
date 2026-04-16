import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuctionCard({ auction, showCreator = false }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const diff = new Date(auction.endTime) - Date.now();
      if (diff <= 0) {
        setTimeLeft('Ended');
      } else {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        
        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const handleEnterAuction = () => {
    navigate(`/auction/${auction._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{auction.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{auction.description}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Current Bid</span>
          <span className="text-2xl font-bold text-green-600">${auction.currentBid}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Time Remaining</span>
          <span className={`font-semibold ${auction.status === 'ended' ? 'text-red-600' : 'text-blue-600'}`}>
            {auction.status === 'ended' ? 'Ended' : timeLeft}
          </span>
        </div>

        {auction.highestBidder && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Leading Bidder</span>
            <span className="text-sm font-medium text-gray-800">{auction.highestBidder.name}</span>
          </div>
        )}

        {showCreator && auction.createdBy && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Created By</span>
            <span className="text-sm font-medium text-gray-800">
              {typeof auction.createdBy === 'object' ? auction.createdBy.name : 'You'}
            </span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <button
          onClick={handleEnterAuction}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
        >
          Enter Auction
        </button>
      </div>

      <div className="mt-3 flex justify-between text-xs text-gray-500">
        <span>Base: ${auction.basePrice}</span>
        <span className={`px-2 py-1 rounded ${auction.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {auction.status}
        </span>
      </div>
    </div>
  );
}

export default AuctionCard;
