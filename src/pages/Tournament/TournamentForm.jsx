import { TrophyIcon } from '@heroicons/react/24/outline';

function TournamentForm({
  currentTournament,
  formData,
  handleInputChange,
  handleSubmit,
  setIsModalOpen,
  resetForm,
}) {
  const tournamentTypes = [
    { value: 'round_robin', label: 'Round Robin' },
    { value: 'knockout', label: 'Knockout' },
    { value: 'league', label: 'League' },
    { value: 'single_elimination', label: 'Single Elimination' },
  ];

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg px-8 pt-8 pb-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
            <TrophyIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="text-center mb-8">
            <h3 className="text-2xl leading-6 font-semibold text-gray-900">
              {currentTournament ? 'Edit Tournament' : 'Create New Tournament'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {currentTournament ? 'Update the tournament details below' : 'Fill in the information to create a new tournament'}
            </p>
          </div>

          <form>
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                  Tournament Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="mt-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 text-left">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    id="start_date"
                    className="mt-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 text-left">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    id="end_date"
                    className="mt-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tournament_type" className="block text-sm font-medium text-gray-700 text-left">
                  Tournament Type
                </label>
                <select
                  name="tournament_type"
                  id="tournament_type"
                  className="mt-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                  value={formData.tournament_type}
                  onChange={handleInputChange}
                >
                  {tournamentTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 text-left">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  className="mt-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 text-left">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  className="mt-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-6 py-3 bg-indigo-600 text-lg font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto"
                onClick={handleSubmit}
              >
                {currentTournament ? 'Update Tournament' : 'Create Tournament'}
              </button>
              <button
                type="button"
                className="w-full mt-4 sm:mt-0 inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-3 bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TournamentForm;
