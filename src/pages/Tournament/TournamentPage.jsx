import React, { useState, useEffect } from 'react';
import TournamentForm from './TournamentForm';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TrophyIcon,
  CalendarIcon,
  UsersIcon,
  MapPinIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import {
  fetchTournaments,
  createTournament,
  updateTournament,
  deleteTournament
} from '../../services/tournamentService';

const TournamentPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTournament, setCurrentTournament] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    team_count: '',
    location: '',
    status: 'upcoming'
  });

  // Fetch tournaments from backend
  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await fetchTournaments();
        setTournaments(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    loadTournaments();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    debugger
    e.preventDefault();
    try {
      if (currentTournament) {
        const updated = await updateTournament(currentTournament.id, formData);
        setTournaments(tournaments.map(t => t.id === updated.id ? updated : t));
      } else {
        const newTournament = await createTournament(formData);
        setTournaments([...tournaments, newTournament]);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteTournament(id);
      setTournaments(tournaments.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      team_count: '',
      location: '',
      status: 'upcoming'
    });
    setCurrentTournament(null);
  };

  // Sort tournaments
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort tournaments
  const filteredTournaments = tournaments
    .filter(tournament =>
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <ArrowPathIcon className="h-12 w-12 text-indigo-600 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Tournaments</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all cricket tournaments
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Create Tournament
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative rounded-md shadow-sm w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md"
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tournaments Table */}
      <div className="shadow overflow-hidden border-b border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Name
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${sortConfig.key === 'name' && sortConfig.direction === 'desc' ? 'transform rotate-180' : ''
                    }`} />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('start_date')}
              >
                <div className="flex items-center">
                  Dates
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${sortConfig.key === 'start_date' && sortConfig.direction === 'desc' ? 'transform rotate-180' : ''
                    }`} />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Teams
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('location')}
              >
                <div className="flex items-center">
                  Location
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${sortConfig.key === 'location' && sortConfig.direction === 'desc' ? 'transform rotate-180' : ''
                    }`} />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('status')}
              >
                <div className="flex items-center">
                  Status
                  <ChevronDownIcon className={`ml-1 h-4 w-4 transition-transform ${sortConfig.key === 'status' && sortConfig.direction === 'desc' ? 'transform rotate-180' : ''
                    }`} />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((tournament) => (
                <tr key={tournament.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <TrophyIcon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {tournament.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <div className="text-sm text-gray-500">
                        {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">{tournament.team_count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">{tournament.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(tournament.status)}`}>
                      {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setCurrentTournament(tournament);
                        setFormData({
                          name: tournament.name,
                          start_date: tournament.start_date,
                          end_date: tournament.end_date,
                          team_count: tournament.team_count,
                          location: tournament.location,
                          status: tournament.status
                        });
                        setIsModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${tournament.name}"?`)) {
                          handleDelete(tournament.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                  No tournaments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <TournamentForm formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} currentTournament={currentTournament} setIsModalOpen={setIsModalOpen} resetForm={resetForm}/>
      )}
    </div>
  );
};

export default TournamentPage;