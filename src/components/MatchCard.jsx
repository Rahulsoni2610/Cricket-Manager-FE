import { TrophyIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/solid';

const MatchCard = ({ match }) => {
  const isCompleted = true;
  const team1 = match.team1_id;
  const team2 = match.team2_id;
  const winner = match.winning_team_id === team1 ? team1 : team2;
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
  const bgGradient = colorClasses[match.id % colorClasses.length];

  return (
    <div className='relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl ring-1 ring-gray-200'>

      <div className={`h-2 bg-gradient-to-r ${bgGradient} rounded-t-2xl`} />

      {/* Match status ribbon */}
      <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold ${isCompleted ? 'bg-green-900 text-white' : 'bg-indigo-900 text-white'
        }`}>
        {isCompleted ? 'COMPLETED' : 'UPCOMING'}
      </div>

      {/* Teams vs */}
      <div className="p-5">
        <div className="flex items-center justify-between">
          {/* Team 1 */}
          <div className="text-center w-2/5">
            <div className="mx-auto h-16 w-16 mb-2 overflow-hidden rounded-full border-2 border-indigo-200">
              <img
                src="https://www.clipartmax.com/png/middle/77-775459_chennai-super-kings-logo.png"
                alt="Chennai Super Kings"
                className="h-full w-full object-contain p-1"
              />
            </div>
            <h4 className="font-bold text-gray-900 truncate">{team1.name}</h4>
            {isCompleted && (
              <p className="text-sm font-mono font-bold mt-1">
                {match.team1_score || '0'}
              </p>
            )}
          </div>

          {/* VS Circle */}
          <div className="relative">
            <div className={`h-12 w-12 bg-gradient-to-br ${bgGradient} rounded-full flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">VS</span>
            </div>
            {isCompleted && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex items-center">
                <TrophyIcon className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-xs font-bold text-gray-700">{winner.name}</span>
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className="text-center w-2/5">
            <div className="mx-auto h-16 w-16 mb-2 overflow-hidden rounded-full border-2 border-indigo-200">
              <img
                src="https://1000logos.net/wp-content/uploads/2022/08/Mumbai-Indians-Logo.png"
                alt={team2.name}
                className="h-full w-full object-contain p-1"
              />
            </div>
            <h4 className="font-bold text-gray-900 truncate">{team2.name}</h4>
            {isCompleted && (
              <p className="text-sm font-mono font-bold mt-1">
                {match.team2_score || '0'}
              </p>
            )}
          </div>
        </div>

        {/* Match Details */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-1 text-indigo-500" />
              <span>{new Date(match.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-4 w-4 mr-1 text-indigo-500" />
              <span className="truncate max-w-[120px]">{match.venue}</span>
            </div>
          </div>

          {/* Action Button */}
          <button className="mt-4 w-full py-2 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 rounded-lg text-indigo-700 font-medium text-sm transition-all">
            {isCompleted ? 'View Highlights' : 'Get Tickets'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;