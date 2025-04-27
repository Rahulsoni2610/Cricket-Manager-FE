import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatLabel } from '../../utils/format';
import {
  ArrowLeftIcon,
  PencilIcon,
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  TrophyIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { fetchPlayerDetails } from '../../services/playerService';

const PlayerDetailsPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        const playerData = await fetchPlayerDetails(id);
        // debugger
        setPlayer(playerData);
      } catch (err) {
        setError('Failed to load player data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Link
          to="/players"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Back to Players
        </Link>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">Player not found</h3>
        <Link
          to="/players"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Back to Players
        </Link>
      </div>
    );
  }

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // Player stats data - you'll replace this with actual stats from your backend
  const playerStats = [
    { name: 'Matches Played', value: '45', icon: TrophyIcon },
    { name: 'Runs Scored', value: '1,245', icon: ChartBarIcon },
    { name: 'Wickets Taken', value: '32', icon: ChartBarIcon },
    { name: 'Highest Score', value: '127', icon: TrophyIcon },
    { name: 'Best Bowling', value: '4/25', icon: TrophyIcon },
    { name: 'Average', value: '38.2', icon: ChartBarIcon }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/players"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Players
        </Link>
      </div>

      {/* Player header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Gradient header */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-indigo-300" />

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            {/* Player info */}
            <div className="flex items-start space-x-6">
              {/* Player avatar - replace with actual image if available */}
              <div className="flex-shrink-0 h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                {player.picture_url ? (
                  <img
                    src={player.picture_url}
                    alt={player.first_name}
                    className="rounded-full"
                  />
                ) : (
                  <UserIcon className="h-6 w-6 text-gray-600" />
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {player.first_name} {player.last_name}
                </h1>
                <p className="mt-1 text-sm text-gray-500">{player.role ? formatLabel(player.role) : 'Player'}</p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Age: {calculateAge(player.date_of_birth)}</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Batting: {player.batting_style ? formatLabel(player.batting_style) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Bowling: {player.bowling_style ? formatLabel(player.bowling_style) : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit button */}
            <div className="mt-4 md:mt-0">
              <Link
                to={`/players/${player.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit Player
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Player Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playerStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-indigo-100">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent matches section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Matches</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {/* This would be replaced with actual match data */}
            {[1, 2, 3].map((match) => (
              <div key={match} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Match #{match}</h3>
                      <p className="text-sm text-gray-500">15 May 2023 • Premier League</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">42 runs • 2 wickets</p>
                    <p className="text-sm text-gray-500">Man of the Match</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right">
            <Link
              to="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              View all matches
            </Link>
          </div>
        </div>
      </div>

      {/* Teams section */}
      {player.teams && player.teams.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Teams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {player.teams.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition flex items-center space-x-4"
              >
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{team.name}</h3>
                  <p className="text-sm text-gray-500">Since 2022</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerDetailsPage;