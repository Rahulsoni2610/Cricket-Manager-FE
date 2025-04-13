export default function PerformanceChart({ matches, className }) {
  const maxScore = Math.max(200, ...matches.map(match => match.score));

  return (
    <div className={`${className} p-4 bg-white rounded-lg shadow-md`}>
      <h3 className="font-medium mb-4 text-gray-700 flex items-center">
        <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Last 5 Matches Performance
      </h3>
      <div className="flex h-64">
        {/* Y-axis with labels */}
        <div className="flex flex-col justify-between mr-2 w-8">
          <span className="text-xs text-gray-500 text-right">{maxScore}</span>
          <span className="text-xs text-gray-500 text-right">{Math.floor(maxScore / 2)}</span>
          <span className="text-xs text-gray-500 text-right">0</span>
        </div>

        {/* Main chart area */}
        <div className="flex-1 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-gray-100"></div>
            <div className="border-t border-gray-100"></div>
            <div className="border-t border-gray-200"></div>
          </div>

          {/* Bars and labels container */}
          <div className="absolute inset-0 flex items-end gap-4">
            {matches.map((match, i) => (
              <div key={i} className="flex-1 h-full flex flex-col px-10">
                {/* Bar container */}
                <div className="relative flex-1">
                  <div
                    className={`w-full rounded-t-md absolute bottom-0 mx-auto ${match.result === 'W'
                      ? 'bg-gradient-to-t from-green-500 to-green-400'
                      : 'bg-gradient-to-t from-red-500 to-red-400'
                      } shadow-md transition-all duration-500 ease-out`}
                    style={{
                      height: `${(match.score / maxScore) * 100}%`,
                      width: '80%', // Makes bars thinner than the column
                      left: '10%'   // Centers the bar
                    }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded">
                      {match.score}
                    </span>
                  </div>
                </div>

                {/* Team name and indicator */}
                <div className="shrink-0 mt-2 text-center h-12">
                  <div className={`h-2 w-2 mx-auto rounded-full mb-1 ${match.result === 'W' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  <p className="text-xs font-medium text-gray-600 truncate">
                    {match.opponent}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {match.date && new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}