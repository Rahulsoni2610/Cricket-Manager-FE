import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Teams from './pages/Team/Teams';
import TeamDetailsPage from './pages/Team/TeamDetailsPage';
import SquadManagement from './pages/Team/SquadManagement';
import Players from './pages/Player/Players';
import PlayerDetailsPage from './pages/Player/PlayerDetailsPage';
import TournamentPage from './pages/Tournament/TournamentPage';
import Matches from './pages/Match/Matches';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsPage from './pages/Analytics/Analytics';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetailsPage />} />
              <Route path="/teams/:id/squad" element={<SquadManagement />} />
              <Route path="/players" element={<Players />} />
              <Route path="/players/:id" element={<PlayerDetailsPage />} />
              <Route path="/tournaments" element={<TournamentPage />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;