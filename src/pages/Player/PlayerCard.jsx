import { Link } from 'react-router-dom';
import { formatLabel } from '../../utils/format';
import {
  UserIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
function PlayerCard({ players, handleDelete, handleEdit, searchTerm }) {
  return (
    <>
      {
        players.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player, index) => {
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
                  key={player.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 duration-300 border border-gray-200"
                >
                  <div className={`h-2 bg-gradient-to-r ${bgGradient} rounded-t-2xl`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-gray-100">
                          {player.picture_url ? (
                            <img
                              src={player.picture_url}
                              alt={player.first_name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <UserIcon className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <h2 className="ml-3 text-lg font-semibold text-gray-800">
                          {player.first_name} {player.last_name}
                        </h2>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(player)}
                          className="text-indigo-500 hover:text-indigo-700 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(player.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>DOB: {player.date_of_birth || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Role: {formatLabel(player.role) || 'Not specified'}</span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Batting: {formatLabel(player.batting_style) || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Bowling: {formatLabel(player.bowling_style) || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <Link
                        to={`/players/${player.id}`}
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        View full details
                        <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No players found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Get started by creating a new player'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Player
              </button>
            </div>
          </div>
        )

      }
    </>
  );
}

export default PlayerCard;