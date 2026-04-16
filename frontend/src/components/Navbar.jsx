import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="text-xl font-bold">Bid Bazaar</Link>
          <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          <Link to="/leaderboard" className="hover:text-blue-200">Leaderboard</Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {user.name}</span>
          <button onClick={onLogout} className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
