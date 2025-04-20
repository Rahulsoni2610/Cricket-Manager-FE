import React, { useState, useEffect } from 'react';
import PlayerCard from './PlayerCard';
import PlayerFormModal from './PlayerFormModal';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
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
    date_of_birth: '',
    batting_style: '',
    bowling_style: '',
    role: '',
    user_id: ''
  });

  // Load players
  const loadPlayers = async () => {
    setLoading(true);
    try {
      const data = await fetchPlayerDetails(searchTerm);
      setPlayers(data.players || data); // Handle both formats
    } catch (error) {
      console.error("Failed to load players:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPlayer) {
        await updatePlayer(currentPlayer.id, formData);
      } else {
        await createPlayer(formData);
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

  // Initial load and reload when search term changes
  useEffect(() => {
    loadPlayers();
  }, [searchTerm]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <ArrowPathIcon className="h-12 w-12 text-indigo-500 animate-spin" />
    </div>
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
              placeholder="Search players..."
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

      <PlayerCard players={players} handleDelete={handleDelete} handleEdit={handleEdit} />


      {/* {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75 z-20"></div>
          </div>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentPlayer ? 'Edit Player' : 'Create New Player'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Role</option>
                    <option value="batsman">Batsman</option>
                    <option value="bowler">Bowler</option>
                    <option value="all_rounder">All Rounder</option>
                    <option value="wicketkeeper">Wicketkeeper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batting Style</label>
                  <select
                    name="batting_style"
                    value={formData.batting_style}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Batting Style</option>
                    <option value="right_handed">Right Handed</option>
                    <option value="left_handed">Left Handed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bowling Style</label>
                  <select
                    name="bowling_style"
                    value={formData.bowling_style}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Bowling Style</option>
                    <option value="right_arm_fast">Right Arm Fast</option>
                    <option value="right_arm_medium">Right Arm Medium</option>
                    <option value="right_arm_spin">Right Arm Spin</option>
                    <option value="left_arm_fast">Left Arm Fast</option>
                    <option value="left_arm_medium">Left Arm Medium</option>
                    <option value="left_arm_spin">Left Arm Spin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {currentPlayer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
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