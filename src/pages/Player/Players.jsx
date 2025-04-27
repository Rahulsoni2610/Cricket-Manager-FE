import React, { useState, useEffect, useRef } from 'react';
import PlayerCard from './PlayerCard';
import PlayerFormModal from './PlayerFormModal';
import {
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import {
  fetchPlayers,
  fetchPlayerDetails,
  createPlayer,
  updatePlayer,
  deletePlayer
} from '../../services/playerService';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    picture: '',
    date_of_birth: '',
    batting_style: '',
    bowling_style: '',
    role: '',
    user_id: ''
  });

  const inputRef = useRef(null);
  // Load players
  const loadPlayers = async (value) => {
    setLoading(true);
    try {
      const data = await fetchPlayers(value);
      setPlayers(data.players || data); // Handle both formats
    } catch (error) {
      console.error("Failed to load players:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "file" ? files[0] : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formNewData = new FormData();
    for (const key in formData) {
      formNewData.append(`player[${key}]`, formData[key]);
    }

    try {
      if (currentPlayer) {
        await updatePlayer(currentPlayer.id, formNewData);
      } else {
        await createPlayer(formNewData);
      }
      setIsModalOpen(false);
      loadPlayers(); // Refresh the list
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  // Handle player deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await deletePlayer(id);
        loadPlayers(); // Refresh the list
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // Reset form and current player
  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      batting_style: '',
      bowling_style: '',
      role: '',
      user_id: ''
    });
    setCurrentPlayer(null);
  };

  // Load player data for editing
  const handleEdit = async (player) => {
    try {
      const playerData = await fetchPlayerDetails(player.id);
      setCurrentPlayer(playerData);
      setFormData({
        first_name: playerData.first_name,
        last_name: playerData.last_name,
        date_of_birth: playerData.date_of_birth,
        batting_style: playerData.batting_style,
        bowling_style: playerData.bowling_style,
        role: playerData.role,
        user_id: playerData.user_id
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Failed to load player:", error);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);


  const filteredPlayers = players.filter(player =>
    player.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Players Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your cricket players</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            New Player
          </button>
        </div>
      </div>

      <PlayerCard players={filteredPlayers} handleDelete={handleDelete} handleEdit={handleEdit} />

      <PlayerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        currentPlayer={currentPlayer}
        resetForm={resetForm}
      />
    </div>
  );
};

export default Players;