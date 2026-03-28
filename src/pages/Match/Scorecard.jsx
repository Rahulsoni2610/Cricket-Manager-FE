import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchMatchState } from '../../services/matchService';

const Scorecard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [matchState, setMatchState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMatchState(id);
        setMatchState(data);
      } catch (e) {
        setError('Failed to load scorecard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Loading scorecard...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!matchState) return <div className="p-8 text-center">Scorecard not found</div>;

  const isLive = matchState.status !== 'completed';

  const resultText = (() => {
    if (isLive) return 'Live Scorecard';
    if (matchState.result === 'tied') return 'Match tied';
    if (matchState.winning_team && matchState.winning_margin) {
      return `${matchState.winning_team.name} won by ${matchState.winning_margin}`;
    }
    return 'Match completed';
  })();

  return (
    <div className="bg-gray-100 min-h-screen pb-12">
      <div className="bg-indigo-900 text-white p-6 shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-indigo-200">Venue</div>
              <div className="text-lg font-semibold">{matchState.venue}</div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {isLive && (
                <Link to={`/match/live/${id}`} className="text-indigo-200 hover:text-white">Back to Live Match</Link>
              )}
              <Link to="/matches" className="text-indigo-200 hover:text-white">Back to Matches</Link>
            </div>
          </div>
          <div className="mt-4 text-xl font-bold">{resultText}</div>
          {isLive && (
            <div className="mt-2 text-xs text-indigo-200">Live Scorecard (In Progress)</div>
          )}
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 mt-6">
        {(matchState.innings || []).length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center text-gray-600">No scorecard data yet</div>
        ) : (matchState.innings || []).map((inn) => (
          <div key={inn.id} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="font-semibold text-gray-900">
                Inning {inn.number}: {inn.batting_team?.name} vs {inn.bowling_team?.name}
              </div>
              <div className="text-gray-700 font-mono">
                {inn.total_runs}/{inn.total_wickets} ({inn.overs}.{inn.balls})
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Batting</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      <th className="text-left py-2">Batsman</th>
                      <th className="text-right py-2">R</th>
                      <th className="text-right py-2">B</th>
                      <th className="text-right py-2">4s</th>
                      <th className="text-right py-2">6s</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(inn.batting_scorecards || []).map((bs) => {
                      const status = bs.how_out ? bs.how_out.replace('_', ' ') : 'not out';
                      return (
                        <tr key={bs.player_id} className="border-b last:border-b-0">
                          <td className="py-2">{bs.name}{bs.is_striking ? ' *' : ''}</td>
                          <td className="py-2 text-right font-mono">{bs.runs}</td>
                          <td className="py-2 text-right font-mono">{bs.balls}</td>
                          <td className="py-2 text-right font-mono">{bs.fours}</td>
                          <td className="py-2 text-right font-mono">{bs.sixes}</td>
                          <td className="py-2 text-left text-gray-600">{status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 pt-0">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bowling</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      <th className="text-left py-2">Bowler</th>
                      <th className="text-right py-2">O</th>
                      <th className="text-right py-2">M</th>
                      <th className="text-right py-2">R</th>
                      <th className="text-right py-2">W</th>
                      <th className="text-right py-2">WD</th>
                      <th className="text-right py-2">NB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(inn.bowling_scorecards || []).map((bs) => (
                      <tr key={bs.player_id} className="border-b last:border-b-0">
                        <td className="py-2">{bs.name}</td>
                        <td className="py-2 text-right font-mono">{bs.overs ?? 0}</td>
                        <td className="py-2 text-right font-mono">{bs.maidens ?? 0}</td>
                        <td className="py-2 text-right font-mono">{bs.runs ?? 0}</td>
                        <td className="py-2 text-right font-mono">{bs.wickets ?? 0}</td>
                        <td className="py-2 text-right font-mono">{bs.wides ?? 0}</td>
                        <td className="py-2 text-right font-mono">{bs.no_balls ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scorecard;
