import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAvailablePlayers, saveSquad, fetchTeamPlayers } from '../../services/teamService';
import { fetchTournaments } from '../../services/tournamentService';
import { UserIcon, UsersIcon, TrophyIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { formatLabel } from '../../utils/format';

const SquadManagement = () => {
  const { id: teamId } = useParams();
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [squadPlayers, setSquadPlayers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedPlayer, setDraggedPlayer] = useState(null);
  const [availableSearchTerm, setavailableSearchTerm] = useState('');
  const [currentSearchTerm, setcurrentSearchTerm] = useState('');

  useEffect(() => {
    fetchTournaments().then(data => {
      setTournaments(data);
      if (data.length > 0) setSelectedTournament(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedTournament) return;

    Promise.all([
      fetchAvailablePlayers(teamId, selectedTournament),
      fetchTeamPlayers(teamId, selectedTournament)
    ]).then(([available, squad]) => {
      setAvailablePlayers(available);
      setSquadPlayers(squad);
    });
  }, [selectedTournament, teamId]);

  const handleDragStart = (player, listType) => {
    setDraggedPlayer({ ...player, fromList: listType });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetList) => {
    e.preventDefault();
    if (!draggedPlayer) return;

    if (draggedPlayer.fromList === 'available' && targetList === 'squad') {
      // Move from available to squad
      setAvailablePlayers(availablePlayers.filter(p => p.id !== draggedPlayer.id));
      setSquadPlayers([...squadPlayers, draggedPlayer]);
    } else if (draggedPlayer.fromList === 'squad' && targetList === 'available') {
      // Move from squad to available
      setSquadPlayers(squadPlayers.filter(p => p.id !== draggedPlayer.id));
      setAvailablePlayers([...availablePlayers, draggedPlayer]);
    }

    setDraggedPlayer(null);
  };

  const movePlayer = (playerId, fromSquad) => {
    if (fromSquad) {
      // Moving from squad to available
      const player = squadPlayers.find(p => p.id === playerId);
      if (player) {
        setSquadPlayers(squadPlayers.filter(p => p.id !== playerId));
        setAvailablePlayers([...availablePlayers, player]);
      }
    } else {
      // Moving from available to squad
      const player = availablePlayers.find(p => p.id === playerId);
      if (player) {
        setAvailablePlayers(availablePlayers.filter(p => p.id !== playerId));
        setSquadPlayers([...squadPlayers, player]);
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveSquad(teamId, selectedTournament, squadPlayers.map(p => p.id));
      alert('Squad saved successfully!');
    } catch (error) {
      console.error("Failed to save squad:", error);
      alert('Error saving squad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAvailablePlayers = availablePlayers.filter(
    (player) =>
      squadPlayers.every((p) => p.id !== player.id) &&
      player.first_name?.toLowerCase().includes(availableSearchTerm.toLowerCase())
  );

  const filteredSquadPlayers = squadPlayers.filter(
    (player) =>
      player.first_name?.toLowerCase().includes(currentSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Squad Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Drag players between squads or click the X to remove
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Tournament
              </label>
              <div className="relative w-64">
                <select
                  value={selectedTournament || ''}
                  onChange={(e) => setSelectedTournament(Number(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <TrophyIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!selectedTournament || isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Squad'}
              {!isSubmitting && <CheckIcon className="ml-2 -mr-1 h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Players */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'available')}
            className="p-6 rounded-xl shadow-sm border-2 border-gray-200 bg-white min-h-[300px]"
          >
            <div className="flex items-center mb-6">
              <UsersIcon className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-medium text-gray-900 ml-2">
                Available Players
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredAvailablePlayers.length}
                </span>
              </h2>
            </div>
            <input
              type="text"
              placeholder="Search players..."
              value={availableSearchTerm}
              onChange={(e) => setavailableSearchTerm(e.target.value)}
              className="mb-4 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />

            {filteredAvailablePlayers.length > 0 ? (
              <div className="space-y-3 overflow-auto max-h-screen">
                {filteredAvailablePlayers.map((player) => (
                  <div
                    key={player.id}
                    draggable
                    onDragStart={() => handleDragStart(player, 'available')}
                    className="flex items-center justify-between p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <UserIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{player.first_name + " " + player.last_name}</h4>
                        <p className="text-xs text-gray-500">Role: {formatLabel(player.role)}</p>
                        <p className="text-xs text-gray-500">Player ID: {player.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePlayer(player.id, false);
                      }}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No players available
              </div>
            )}
          </div>

          {/* Current Squad */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'squad')}
            className="p-6 rounded-xl shadow-sm border-2 border-gray-200 bg-white min-h-[300px]"
          >
            <div className="flex items-center mb-6">
              <UserIcon className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-medium text-gray-900 ml-2">
                Current Squad
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredSquadPlayers.length}
                </span>
              </h2>
            </div>
            <input
              type="text"
              placeholder="Search players..."
              value={currentSearchTerm}
              onChange={(e) => setcurrentSearchTerm(e.target.value)}
              className="mb-4 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {filteredSquadPlayers.length > 0 ? (
              <div className="space-y-3 overflow-auto max-h-screen">
                {filteredSquadPlayers.map((player) => (
                  <div
                    key={player.id}
                    draggable
                    onDragStart={() => handleDragStart(player, 'squad')}
                    className="flex items-center justify-between p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <UserIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{player.first_name + " " + player.last_name}</h4>
                        <p className="text-xs text-gray-500">Role: {formatLabel(player.role)}</p>
                        <p className="text-xs text-gray-500">Player ID: {player.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        movePlayer(player.id, true);
                      }}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Drop players here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SquadManagement;