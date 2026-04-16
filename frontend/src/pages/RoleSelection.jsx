import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function RoleSelection() {
  const navigate = useNavigate();
  const [marketplaceType, setMarketplaceType] = useState('');

  useEffect(() => {
    const type = localStorage.getItem('marketplaceType');
    if (!type) {
      navigate('/marketplace');
      return;
    }
    setMarketplaceType(type);
  }, [navigate]);

  const handleRoleSelect = (role) => {
    localStorage.setItem('userRole', role);
    navigate('/auction-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Select Your Role</h1>
          <p className="text-white text-lg">
            {marketplaceType === 'private' ? '🏢 Private' : '🏛️ Government'} Marketplace
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Auction Creator */}
          <div 
            onClick={() => handleRoleSelect('creator')}
            className="bg-white rounded-lg shadow-2xl p-8 cursor-pointer hover:scale-105 transition transform"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Auction Creator</h2>
              <p className="text-gray-600 mb-6">
                Create and manage auctions. Set prices, durations, and monitor bids in real-time.
              </p>
              <ul className="text-left text-gray-600 mb-6 space-y-2">
                <li>✓ Create new auctions</li>
                <li>✓ Set custom rules</li>
                <li>✓ Monitor all bids</li>
                <li>✓ Manage auction lifecycle</li>
              </ul>
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold">
                I'm a Creator
              </button>
            </div>
          </div>

          {/* Bidder */}
          <div 
            onClick={() => handleRoleSelect('bidder')}
            className="bg-white rounded-lg shadow-2xl p-8 cursor-pointer hover:scale-105 transition transform"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💰</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Bidder</h2>
              <p className="text-gray-600 mb-6">
                Browse and bid on auctions. Use auto-bidding and track your wins on the leaderboard.
              </p>
              <ul className="text-left text-gray-600 mb-6 space-y-2">
                <li>✓ Browse all auctions</li>
                <li>✓ Place manual bids</li>
                <li>✓ Set auto-bid limits</li>
                <li>✓ View leaderboard</li>
              </ul>
              <button className="w-full bg-pink-600 text-white py-3 rounded-lg hover:bg-pink-700 font-semibold">
                I'm a Bidder
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <button 
            onClick={() => navigate('/marketplace')}
            className="text-white hover:underline"
          >
            ← Back to Marketplace Selection
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelection;
