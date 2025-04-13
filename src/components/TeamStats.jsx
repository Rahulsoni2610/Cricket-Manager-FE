export default function TeamStats({ stats, className }) {
  const statItems = [
    { label: "Total Matches", value: stats.totalMatches, icon: "🏏" },
    { label: "Wins", value: stats.wins, icon: "✅" },
    { label: "Win %", value: `${stats.winPercentage}%`, icon: "📊" },
    { label: "Highest Score", value: stats.highestScore, icon: "🔥" },
    { label: "Average Score", value: stats.avgScore, icon: "📈" },
    { label: "Top Player", value: stats.topPlayer, icon: "👑" },
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
      {statItems.map((item, index) => (
        <div key={index} className="bg-white p-3 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{item.label}</span>
            <span>{item.icon}</span>
          </div>
          <p className="text-xl font-bold mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}