import React, { useState, useEffect } from 'react';
import InputField from '../../components/InputField';
import SelectField from '../../components/SelectField';
import { fetchPlayers } from '../../services/playerService';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam
} from '../../services/teamService';
import TeamCard from './TeamCard';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    home_ground: '',
    captain_id: '',
    vice_captain_id: ''
  });

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm();
  };


  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchTeams();
        setTeams(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load teams:", error);
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const data = await fetchPlayers();
        setPlayers(data);
      } catch (error) {
        console.error("Failed to load players:", error);
      }
    };
    loadPlayers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentTeam) {
        const updated = await updateTeam(currentTeam.id, formData);
        setTeams(teams.map(t => t.id === updated.id ? updated : t));
      } else {
        const newTeam = await createTeam(formData);
        setTeams([...teams, newTeam]);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await deleteTeam(id);
        setTeams(teams.filter(t => t.id !== id));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      logo_url: '',
      home_ground: '',
      captain_id: '',
      vice_captain_id: ''
    });
    setCurrentTeam(null);
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center text-gray-600 mt-10">Loading teams...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Teams Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">Manage your cricket teams and players</p>
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
            New Team
          </button>
        </div>
      </div>

      {/* Team Cards */}
      <TeamCard filteredTeams={filteredTeams} setCurrentTeam={setCurrentTeam} setIsModalOpen={setIsModalOpen} onEdit={setFormData} onDelete={handleDelete} setFormData={setFormData} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="fixed inset-0 bg-gray-500 opacity-75 z-10" aria-hidden="true" />

          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative z-30">
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
              {currentTeam ? 'Edit Team' : 'Create New Team'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter team name"
                required
              />
              <InputField
                label="Team Logo"
                name="logo_url"
                value={formData.logo_url}
                onChange={handleInputChange}
                placeholder="Enter logo URL"
              />
              <InputField
                label="Home Ground"
                name="home_ground"
                value={formData.home_ground}
                onChange={handleInputChange}
                placeholder="Enter home ground"
              />
              <SelectField
                label="Captain"
                name="captain_id"
                value={formData.captain_id}
                onChange={handleInputChange}
                placeholder='Select a captain'
                options={players
                  .map(player => ({
                    value: player.id,
                    label: player.first_name + ' ' + player.last_name
                  }))
                }
              />

              <SelectField
                label="Vice Captain"
                name="vice_captain_id"
                value={formData.vice_captain_id}
                onChange={handleInputChange}
                placeholder='Select a vice captain'
                options={players
                  .map(player => ({
                    value: player.id,
                    label: player.first_name + ' ' + player.last_name
                  }))
                }
              />

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm rounded-md border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {currentTeam ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
