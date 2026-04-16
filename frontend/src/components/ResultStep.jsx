import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResultStep({ userId, ocrData, faceMatchScore, verificationResult, setVerificationResult }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    performVerification();
  }, []);

  const performVerification = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/kyc/verify', {
        userId,
        faceMatchScore
      });

      setVerificationResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Result</h2>
        <p className="text-gray-600">Final verification status</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700 mb-2">🔐 Verifying identity...</p>
          <p className="text-sm text-gray-500">Storing proof on blockchain...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
          <button
            onClick={performVerification}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Status */}
          <div className={`text-center py-8 rounded-xl ${
            verificationResult.isVerified 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
              : 'bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200'
          }`}>
            <div className="text-7xl mb-4">
              {verificationResult.isVerified ? '🎉' : '❌'}
            </div>
            <h3 className={`text-3xl font-bold mb-2 ${
              verificationResult.isVerified ? 'text-green-700' : 'text-red-700'
            }`}>
              {verificationResult.isVerified ? 'Verified!' : 'Verification Failed'}
            </h3>
            <p className="text-gray-600">
              {verificationResult.isVerified 
                ? 'Your identity has been successfully verified' 
                : 'Unable to verify your identity'}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Verification Status</p>
              <p className="text-lg font-semibold capitalize">{verificationResult.verificationStatus}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Match Score</p>
              <p className="text-lg font-semibold">{(verificationResult.matchScore * 100).toFixed(1)}%</p>
            </div>

            {verificationResult.isVerified && (
              <>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Blockchain Verified</p>
                    <span className="text-2xl">🔗</span>
                  </div>
                  <p className="text-xs font-mono break-all text-gray-700">
                    {verificationResult.blockchainTxHash}
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    ✅ Your verification is now stored on the blockchain and cannot be tampered with
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleDashboard}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Go to Dashboard
            </button>

            {verificationResult.isVerified && (
              <button
                onClick={() => navigate('/auction')}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Start Bidding in Auctions
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultStep;
