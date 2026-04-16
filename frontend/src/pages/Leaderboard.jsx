import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Leaderboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    socket.on('leaderboardUpdate', (leaderboard) => {
      setUsers(leaderboard);
    });

    return () => {
      socket.off('leaderboardUpdate');
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/leaderboard');
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'; // Gold
      case 1:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'; // Silver
      case 2:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'; // Bronze
      default:
        return 'bg-white hover:bg-gray-50';
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-xl text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top bidders ranked by wins and total spent</p>
        </div>

        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-100 shadow-md transition font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {users.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-gray-500 text-lg">No data yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Start bidding to appear on the leaderboard!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left font-bold">Rank</th>
                    <th className="py-4 px-6 text-left font-bold">Username</th>
                    <th className="py-4 px-6 text-center font-bold">Auctions Won</th>
                    <th className="py-4 px-6 text-center font-bold">Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className={`border-b border-gray-200 transition-all duration-200 ${getRankStyle(index)}`}
                    >
                      {/* Rank */}
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <span className={`text-2xl font-bold ${
                            index < 3 ? 'text-3xl' : 'text-gray-600'
                          }`}>
                            {getRankIcon(index)}
                          </span>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mr-4 ${
                            index === 0 ? 'bg-yellow-200 text-yellow-800' :
                            index === 1 ? 'bg-gray-200 text-gray-800' :
                            index === 2 ? 'bg-orange-200 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-gray-800'}`}>
                              {user.name}
                            </p>
                            <p className={`text-sm ${index < 3 ? 'text-white text-opacity-80' : 'text-gray-600'}`}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Auctions Won */}
                      <td className="py-5 px-6 text-center">
                        <div className={`inline-flex items-center justify-center px-4 py-2 rounded-full font-bold ${
                          index < 3 
                            ? 'bg-white bg-opacity-30 text-white' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          <span className="text-xl">{user.totalWins}</span>
                          <span className="ml-2 text-sm">🏆</span>
                        </div>
                      </td>

                      {/* Total Spent */}
                      <td className="py-5 px-6 text-center">
                        <div className={`font-bold text-xl ${
                          index < 3 ? 'text-white' : 'text-blue-600'
                        }`}>
                          ${user.totalSpent.toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">Total Participants</p>
              <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">Total Auctions Won</p>
              <p className="text-3xl font-bold text-green-600">
                {users.reduce((sum, user) => sum + user.totalWins, 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <p className="text-gray-600 text-sm mb-1">Total Amount Spent</p>
              <p className="text-3xl font-bold text-purple-600">
                ${users.reduce((sum, user) => sum + user.totalSpent, 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Real-time Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            <span className="text-sm font-semibold">Live Updates Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
