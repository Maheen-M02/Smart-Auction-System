import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import SimpleLogin from './pages/SimpleLogin';
import MarketplaceType from './pages/MarketplaceType';
import RoleSelection from './pages/RoleSelection';
import BidderDashboard from './pages/BidderDashboard';
import CreatorDashboard from './pages/CreatorDashboard';
import AuctionDetail from './pages/AuctionDetail';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<SimpleLogin />} />
          
          {/* Auction Routes */}
          <Route path="/marketplace" element={<MarketplaceType />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/auction-dashboard" element={<AuctionDashboard />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* Redirect old routes */}
          <Route path="/kyc" element={<Navigate to="/register" />} />
          <Route path="/dashboard" element={<Navigate to="/marketplace" />} />
        </Routes>
      </div>
    </Router>
  );
}

// Auction Dashboard Router
function AuctionDashboard() {
  const userRole = localStorage.getItem('userRole');
  
  if (userRole === 'creator') {
    return <CreatorDashboard />;
  } else if (userRole === 'bidder') {
    return <BidderDashboard />;
  } else {
    return <Navigate to="/role-selection" />;
  }
}

export default App;
