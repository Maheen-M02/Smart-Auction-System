import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SimpleLogin() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email && !phone) {
      setError('Please enter email or phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', {
        email: email || undefined,
        phone: phone || undefined
      });

      // Store user data for auction system
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('userEmail', email || '');
      localStorage.setItem('userType', response.data.userType);
      localStorage.setItem('isVerified', response.data.isVerified ? 'true' : 'false');
      localStorage.setItem('kycCompleted', response.data.kycCompleted ? 'true' : 'false');
      
      // Redirect to marketplace if verified, otherwise to registration
      if (response.data.isVerified) {
        navigate('/marketplace');
      } else {
        navigate('/register');
      }
      
    } catch (err) {
      if (err.response?.data?.needsRegistration) {
        setError('Account not found. Please register first.');
      } else {
        setError(err.response?.data?.error || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Login to your auction account</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div className="text-center text-gray-500">OR</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!email && !phone)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleLogin;
