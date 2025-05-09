import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTeamDetails } from '../../services/teamService';
import { UserGroupIcon, CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
import PlayersCard from './PlayersCard';

const TeamDetailsPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const data = await fetchTeamDetails(id);
        setTeam(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load team:", error);
        setLoading(false);
      }
    };
    loadTeam();
  }, [id]);

  if (loading) return <div>Loading team details...</div>;
  if (!team) return <div>Team not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-gray-100">
                    {team.logo_url ? (
                      <img
                        src={team.logo_url}
                        alt={team.name}
                        className="h-6 w-6 rounded-full"
                      />
                    ) : <UserGroupIcon className="h-6 w-6 text-gray-600" />}
                  </div>
                </div>
                <h1 className="text-3xl font-bold ml-2">{team.name}</h1>
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Founded: {new Date(team.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Home Ground: {team.home_ground}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Captain: {team.captain ? `${team.captain.first_name} ${team.captain.last_name}` : 'TBD'}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Vice Captain: {team.vice_captain ? `${team.vice_captain.first_name} ${team.vice_captain.last_name}` : 'TBD'}</span>
                </div>
              </div>
            </div>
            <Link
              to="/teams"
              className="text-blue-600 hover:text-blue-800"
            >
              Back to Teams
            </Link>
          </div>

          {/* Team Players Section */}
          <PlayersCard team={team} />

          {/* Team Matches Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
            {team.matches && team.matches.length > 0 ? (
              <div className="space-y-2">
                {team.matches.map(match => (
                  <div key={match.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{match.opponent}</span>
                      <span className="text-sm text-gray-600">
                        {new Date(match.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Venue: {match.venue}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No upcoming matches scheduled.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsPage;