import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline';

function TeamCard({ searchTerm, filteredTeams, setCurrentTeam, setIsModalOpen, setFormData, handleDelete }) {
  return (
    <>
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
                        {team.logo_url ? (
                          <img
                            src={team.logo_url}
                            alt={team.name}
                            className="h-6 w-6 rounded-full"
                          />
                        ) : <UserGroupIcon className="h-6 w-6 text-gray-600" />}

                      </div>
                      <h2 className="ml-3 text-lg font-semibold text-gray-800">{team.name}</h2>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setCurrentTeam(team);
                          setFormData({
                            name: team.name,
                            logo_url: team.logo_url,
                            home_ground: team.home_ground,
                            captain_id: team.captain?.id,
                            vice_captain_id: team.vice_captain?.id
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
                    {/* <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Founded: {team.founded_year || 'N/A'}</span>
                    </div> */}
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Home: {team.home_ground || 'No home ground'}</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Captain: {team.captain ? `${team.captain.first_name} ${team.captain.last_name}` : 'TBD'}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                      <span>V Captain: {team.vice_captain ? `${team.vice_captain.first_name} ${team.vice_captain.last_name}` : 'TBD'}</span>
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
    </>
  );
}

export default TeamCard;