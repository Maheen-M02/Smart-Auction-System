import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setUserId, setIsVerified }) {
  const [govtId, setGovtId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { govtId });
      
      setUserId(response.data.userId);
      setIsVerified(response.data.isVerified);
      
      if (response.data.redirectTo === '/dashboard') {
        navigate('/dashboard');
      } else {
        navigate('/kyc');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">KYC Verification</h1>
          <p className="text-gray-600">Login with Government ID</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Government ID
            </label>
            <input
              type="text"
              value={govtId}
              onChange={(e) => setGovtId(e.target.value.toUpperCase())}
              placeholder="PAN: ABCDE1234F or Aadhaar: 123456789012"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <p className="mt-2 text-xs text-gray-500">
              PAN format: 5 letters + 4 digits + 1 letter<br />
              Aadhaar format: 12 digits
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Login / Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>🔒 Secure • 🌐 Blockchain Verified • ✅ AI-Powered</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
