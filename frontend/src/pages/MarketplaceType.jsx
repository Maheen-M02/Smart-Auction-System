import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MarketplaceType() {
  const navigate = useNavigate();

  const handleMarketplaceSelect = (type) => {
    localStorage.setItem('marketplaceType', type);
    navigate('/role-selection');
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Select Marketplace Type</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Private Marketplace */}
          <div 
            onClick={() => handleMarketplaceSelect('private')}
            className="bg-white rounded-lg shadow-2xl p-8 cursor-pointer hover:scale-105 transition transform"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Private Marketplace</h2>
              <p className="text-gray-600 mb-6">
                For businesses, organizations, and private auctions. Controlled access and custom rules.
              </p>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold">
                Select Private
              </button>
            </div>
          </div>

          {/* Government Marketplace */}
          <div 
            onClick={() => handleMarketplaceSelect('government')}
            className="bg-white rounded-lg shadow-2xl p-8 cursor-pointer hover:scale-105 transition transform"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🏛️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Government Marketplace</h2>
              <p className="text-gray-600 mb-6">
                For government tenders, public procurement, and official auctions. Transparent and regulated.
              </p>
              <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
                Select Government
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceType;
