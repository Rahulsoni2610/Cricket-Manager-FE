// import { useState, useEffect } from 'react';
// import StatsCard from '../components/StatsCard';
// import SimpleChart from '../components/SimpleChart';
// import { fetchAnalytics } from '../services/analytics';

// export default function AnalyticsPage() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     fetchAnalytics().then(setData);
//   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-6">Team Analytics</h1>

//       {/* Key Stats Row */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//         <StatsCard
//           title="Total Matches"
//           value={data?.totalMatches || 0}
//           icon="🏏"
//         />
//         <StatsCard
//           title="Win Rate"
//           value={data?.winRate ? `${data.winRate}%` : '0%'}
//           icon="📊"
//         />
//         <StatsCard
//           title="Avg. Score"
//           value={data?.avgScore || 0}
//           icon="🔥"
//         />
//       </div>

//       {/* Simple Chart */}
//       {data && (
//         <SimpleChart
//           title="Recent Performance"
//           data={data.last5Matches}
//         />
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import TeamSelector from '../../components/TeamSelector';
import TeamStats from '../../components/TeamStats';
import PerformanceChart from '../../components/PerformanceChart';
import { fetchTeams, fetchTeamStats } from '../../services/analytics';

export default function Analytics() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchTeams().then(setTeams);
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamStats(selectedTeam.id).then(setStats);
    }
  }, [selectedTeam]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Team Analytics</h1>

      {/* Team Selection */}
      <TeamSelector
        teams={teams}
        onSelect={setSelectedTeam}
        className="mb-8"
      />

      {stats && (
        <>
          {/* Key Stats */}
          <TeamStats stats={stats} className="mb-8" />

          {/* Performance Chart */}
          <PerformanceChart
            matches={stats.recentMatches}
            className="bg-white p-4 rounded-lg shadow"
          />
        </>
      )}
    </div>
  );
}