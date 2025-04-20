// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   PlusIcon,
//   PencilIcon,
//   TrashIcon,
//   UserGroupIcon,
//   CalendarIcon,
//   MapPinIcon,
//   UserIcon,
//   MagnifyingGlassIcon
// } from '@heroicons/react/24/outline';
// import {
//   fetchTeams,
//   createTeam,
//   updateTeam,
//   deleteTeam
// } from '../services/teamService';

// const Teams = () => {
//   const [teams, setTeams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentTeam, setCurrentTeam] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     founded_year: '',
//     home_ground: '',
//     captain: '',
//     coach: ''
//   });

//   // Fetch teams
//   useEffect(() => {
//     const loadTeams = async () => {
//       try {
//         const data = await fetchTeams();
//         setTeams(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to load teams:", error);
//         setLoading(false);
//       }
//     };
//     loadTeams();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (currentTeam) {
//         const updated = await updateTeam(currentTeam.id, formData);
//         setTeams(teams.map(t => t.id === updated.id ? updated : t));
//       } else {
//         const newTeam = await createTeam(formData);
//         setTeams([...teams, newTeam]);
//       }
//       setIsModalOpen(false);
//       resetForm();
//     } catch (error) {
//       console.error("Operation failed:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this team?")) {
//       try {
//         await deleteTeam(id);
//         setTeams(teams.filter(t => t.id !== id));
//       } catch (error) {
//         console.error("Delete failed:", error);
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       name: '',
//       founded_year: '',
//       home_ground: '',
//       captain: '',
//       coach: ''
//     });
//     setCurrentTeam(null);
//   };

//   const filteredTeams = teams.filter(team =>
//     team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     team.captain.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div>Loading teams...</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Header with Search and Create Button */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Teams Dashboard</h1>
//           <p className="mt-2 text-gray-600">Manage your cricket teams and players</p>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//           <div className="relative flex-grow max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Search teams..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <button
//             onClick={() => {
//               resetForm();
//               setIsModalOpen(true);
//             }}
//             className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//           >
//             <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
//             New Team
//           </button>
//         </div>
//       </div>

//       {/* Teams Grid */}
//       {filteredTeams.length > 0 ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredTeams.map(team => (
//             <div key={team.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//               <div className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="p-3 rounded-full bg-indigo-100">
//                       <UserGroupIcon className="h-6 w-6 text-indigo-600" />
//                     </div>
//                     <h2 className="ml-4 text-xl font-semibold text-gray-900">{team.name}</h2>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => {
//                         setCurrentTeam(team);
//                         setFormData({
//                           name: team.name,
//                           founded_year: team.founded_year,
//                           home_ground: team.home_ground,
//                           captain: team.captain,
//                           coach: team.coach
//                         });
//                         setIsModalOpen(true);
//                       }}
//                       className="text-indigo-600 hover:text-indigo-900"
//                     >
//                       <PencilIcon className="h-5 w-5" />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(team.id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       <TrashIcon className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="mt-6 space-y-3">
//                   <div className="flex items-center">
//                     <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
//                     <span className="text-gray-600">Founded: {team.founded_year || 'N/A'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
//                     <span className="text-gray-600">{team.home_ground || 'No home ground'}</span>
//                   </div>
//                   <div className="flex items-center">
//                     <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
//                     <span className="text-gray-600">Captain: {team.captain || 'TBD'}</span>
//                   </div>
//                 </div>

//                 <div className="mt-6 pt-4 border-t border-gray-100">
//                   <Link
//                     to={`/teams/${team.id}`}
//                     className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-medium"
//                   >
//                     View full details
//                     <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-sm p-8 text-center">
//           <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-lg font-medium text-gray-900">No teams found</h3>
//           <p className="mt-1 text-gray-500">
//             {searchTerm ? 'Try a different search term' : 'Get started by creating a new team'}
//           </p>
//           <div className="mt-6">
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
//               New Team
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Keep the same modal component from previous implementation */}
//       {isModalOpen && (
//         <TeamFormModal
//           formData={formData}
//           onInputChange={handleInputChange}
//           onSubmit={handleSubmit}
//           onClose={() => {
//             setIsModalOpen(false);
//             resetForm();
//           }}
//           isEditing={!!currentTeam}
//         />
//       )}
//     </div>
//   );
// };

// export default Teams;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  fetchTeams,
  createTeam,
  updateTeam,
  deleteTeam
} from '../../services/teamService';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    founded_year: '',
    home_ground: '',
    captain: '',
    coach: ''
  });

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
      founded_year: '',
      home_ground: '',
      captain: '',
      coach: ''
    });
    setCurrentTeam(null);
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.captain.toLowerCase().includes(searchTerm.toLowerCase())
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
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map((team, index) => {
            const colorClasses = [
              'from-indigo-500 to-indigo-300',
              'from-pink-500 to-pink-300',
              'from-green-500 to-green-300',
              'from-yellow-500 to-yellow-300',
              'from-blue-500 to-blue-300',
              'from-purple-500 to-purple-300',
              'from-rose-500 to-rose-300',
              'from-teal-500 to-teal-300'
            ];
            const bgGradient = colorClasses[index % colorClasses.length];

            return (
              <div
                key={team.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 duration-300 border border-gray-200"
              >
                <div className={`h-2 bg-gradient-to-r ${bgGradient} rounded-t-2xl`} />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-full bg-gray-100">
                        <UserGroupIcon className="h-6 w-6 text-gray-600" />
                      </div>
                      <h2 className="ml-3 text-lg font-semibold text-gray-800">{team.name}</h2>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentTeam(team);
                          setFormData({
                            name: team.name,
                            founded_year: team.founded_year,
                            home_ground: team.home_ground,
                            captain: team.captain,
                            coach: team.coach
                          });
                          setIsModalOpen(true);
                        }}
                        className="text-indigo-500 hover:text-indigo-700 transition-colors"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Founded: {team.founded_year || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{team.home_ground || 'No home ground'}</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Captain: {team.captain.first_name || 'TBD'}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Tournaments: {team.tournaments_count || 0}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between">
                    <Link
                      to={`/teams/${team.id}/squad`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Manage Squad
                    </Link>
                    <Link
                      to={`/teams/${team.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No teams found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'Get started by creating a new team'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              New Team
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
              {currentTeam ? 'Edit Team' : 'Create New Team'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'founded_year', 'home_ground', 'captain', 'coach'].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-indigo-500"
                />
              ))}

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
