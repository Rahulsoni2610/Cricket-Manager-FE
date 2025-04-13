import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTeamDetails } from '../services/teamService';
import { UserGroupIcon, CalendarIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline';

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
              <h1 className="text-3xl font-bold">{team.name}</h1>
              <div className="mt-4 space-y-3">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Founded: {team.founded_year}</span>
                </div>
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Home Ground: {team.home_ground}</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Captain: {team.captain}</span>
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <span>Coach: {team.coach}</span>
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
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Players</h2>
            {team.players && team.players.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.players.map(player => (
                  <div key={player.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{player.name}</h3>
                    <p className="text-sm text-gray-600">Role: {player.role}</p>
                    <p className="text-sm text-gray-600">Batting Style: {player.batting_style}</p>
                    <p className="text-sm text-gray-600">Bowling Style: {player.bowling_style}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No players found for this team.</p>
            )}
          </div>

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