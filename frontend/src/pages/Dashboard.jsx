import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard({ userId }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/register');
      return;
    }
    fetchUserData(userId);
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/kyc/status/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('isVerified');
    localStorage.removeItem('kycCompleted');
    localStorage.removeItem('marketplaceType');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const goToAuctionPlatform = () => {
    // Store user data for auction system
    if (userData) {
      localStorage.setItem('userName', userData.extractedName || userData.name);
      localStorage.setItem('userEmail', userData.email || '');
      localStorage.setItem('userType', userData.userType || 'bidder');
      localStorage.setItem('isVerified', 'true');
      localStorage.setItem('kycCompleted', 'true');
    }
    
    // Navigate to marketplace selection (internal route)
    navigate('/marketplace');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
              <p className="text-gray-600">Your verification status</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </div>

          {/* Verification Status Card */}
          <div className={`p-6 rounded-xl mb-6 ${
            userData?.isVerified ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  {userData?.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                </h2>
                <p className="text-gray-700">
                  Status: <span className="font-semibold">{userData?.verificationStatus}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  User Type: <span className="font-semibold capitalize">{userData?.userType === 'auctionLister' ? 'Auction Lister' : 'Bidder'}</span>
                </p>
              </div>
              <div className="text-5xl">
                {userData?.isVerified ? '🎉' : '⏰'}
              </div>
            </div>
          </div>

          {/* KYC Details */}
          {userData?.isVerified && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Name</p>
                  <p className="font-semibold">{userData.extractedName || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">ID Number</p>
                  <p className="font-semibold">{userData.idNumber || 'N/A'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Face Match Score</p>
                  <p className="font-semibold">{(userData.faceMatchScore * 100).toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Blockchain Status</p>
                  <p className="font-semibold">🔗 Verified</p>
                </div>
              </div>

              {userData.blockchainTxHash && (
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Blockchain Transaction</p>
                  <p className="font-mono text-xs break-all">{userData.blockchainTxHash}</p>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✅ You are now verified and can participate in auctions
                </p>
              </div>

              {/* Go to Auction Platform Button */}
              <button
                onClick={goToAuctionPlatform}
                className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <span className="text-2xl">🎯</span>
                Go to Auction Platform
                <span className="text-2xl">→</span>
              </button>
            </div>
          )}

          {!userData?.isVerified && (
            <div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Complete KYC verification to access the auction platform
                </p>
              </div>
              <button
                onClick={() => navigate('/register')}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Complete KYC Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
