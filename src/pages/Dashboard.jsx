import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboardData } from '../services/dashboard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!dashboardData) return <div className="p-4">No data available</div>;

  return (
    <div className="space-y-6 p-4">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {dashboardData?.welcome_message || 'User'}!
        </h1>
        <p className="mt-1 text-gray-600">
          {'Here are your latest stats'}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Team Count Stat */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Teams</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.team_count || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Player Count Stat */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Players</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboardData?.player_count || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Add more stats here if needed */}
      </div>

      {/* Upcoming Matches */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Matches</h2>
        <div className="mt-4 space-y-4">
          {dashboardData?.upcoming_matches?.length > 0 ? (
            dashboardData.upcoming_matches.map((match, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {match.team1} vs {match.team2}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(match.date).toLocaleDateString()} at {match.venue}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No upcoming matches scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
}