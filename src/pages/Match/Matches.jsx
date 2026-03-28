import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import MatchCard from './MatchCard';
import SelectField from '../../components/SelectField';
import { fetchMatches, startMatch } from '../../services/matchService';
import { fetchTeams, fetchTeamPlayers } from '../../services/teamService';

const STATUS_TABS = [
  { key: 'live', label: 'Live' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' }
];

const normalizeStatus = (status) => {
  const value = (status || 'upcoming').toLowerCase();
  if (value === 'paused') return 'live';
  if (value === 'completed') return 'completed';
  if (value === 'live') return 'live';
  return 'upcoming';
};

const normalizePlayers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload?.players) return payload.players;
  if (payload?.data) return payload.data;
  return [];
};

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('live');

  const [teamDirectory, setTeamDirectory] = useState({});
  const [startMatchId, setStartMatchId] = useState(null);
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [selection, setSelection] = useState({
    tossWinnerId: '',
    tossChoice: '',
    teamA: [],
    teamB: []
  });

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await fetchMatches();
        setMatches(data);
      } catch (error) {
        console.error('Failed to load matches:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMatches();
  }, []);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchTeams();
        const directory = (data || []).reduce((acc, team) => {
          acc[team.id] = team;
          return acc;
        }, {});
        setTeamDirectory(directory);
      } catch (error) {
        console.error('Failed to load teams:', error);
      }
    };
    loadTeams();
  }, []);

  const currentMatch = matches.find((match) => match.id === startMatchId);

  useEffect(() => {
    const loadPlayers = async () => {
      if (!currentMatch) return;
      setStartLoading(true);
      setStartError('');
      try {
        const team1Id = currentMatch.team1_id || currentMatch.team1?.id;
        const team2Id = currentMatch.team2_id || currentMatch.team2?.id;

        const [team1Data, team2Data] = await Promise.all([
          fetchTeamPlayers(team1Id),
          fetchTeamPlayers(team2Id)
        ]);

        setTeamAPlayers(normalizePlayers(team1Data));
        setTeamBPlayers(normalizePlayers(team2Data));
      } catch (error) {
        console.error('Failed to load team players', error);
        setStartError('Unable to load players for both teams.');
      } finally {
        setStartLoading(false);
      }
    };

    if (startMatchId) {
      loadPlayers();
    } else {
      setTeamAPlayers([]);
      setTeamBPlayers([]);
      setSelection({ tossWinnerId: '', tossChoice: '', teamA: [], teamB: [] });
      setStartError('');
    }
  }, [startMatchId, currentMatch?.team1_id, currentMatch?.team2_id]);

  const playersPerSide = currentMatch?.players_per_side || 11;
  const team1Id = currentMatch?.team1_id || currentMatch?.team1?.id;
  const team2Id = currentMatch?.team2_id || currentMatch?.team2?.id;
  const team1Name = currentMatch?.team1?.name || currentMatch?.team1_name || teamDirectory[team1Id]?.name || 'Team A';
  const team2Name = currentMatch?.team2?.name || currentMatch?.team2_name || teamDirectory[team2Id]?.name || 'Team B';

  const tossOptions = useMemo(() => ([
    { label: team1Name, value: team1Id },
    { label: team2Name, value: team2Id },
  ].filter(option => option.value)), [team1Name, team2Name, team1Id, team2Id]);

  const filteredMatches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return matches
      .filter((match) => normalizeStatus(match.status) === activeTab)
      .filter((match) => {
        if (!term) return true;
        const t1 = match.team1?.name?.toLowerCase()
          || match.team1_name?.toLowerCase()
          || teamDirectory[match.team1_id]?.name?.toLowerCase()
          || '';
        const t2 = match.team2?.name?.toLowerCase()
          || match.team2_name?.toLowerCase()
          || teamDirectory[match.team2_id]?.name?.toLowerCase()
          || '';
        const venue = match.venue?.toLowerCase() || '';
        return t1.includes(term) || t2.includes(term) || venue.includes(term);
      });
  }, [matches, searchTerm, activeTab, teamDirectory]);

  const tabIndex = STATUS_TABS.findIndex((tab) => tab.key === activeTab);

  const handleOpenStart = (match) => {
    setStartMatchId(match.id);
    setSelection({ tossWinnerId: '', tossChoice: '', teamA: [], teamB: [] });
  };

  const togglePlayer = (teamKey, playerId) => {
    setSelection((prev) => {
      const selected = prev[teamKey];
      const exists = selected.includes(playerId);
      if (exists) {
        return { ...prev, [teamKey]: selected.filter((id) => id !== playerId) };
      }
      const otherKey = teamKey === 'teamA' ? 'teamB' : 'teamA';
      if (prev[otherKey].includes(playerId)) {
        return prev;
      }
      if (selected.length >= playersPerSide) {
        return prev;
      }
      return { ...prev, [teamKey]: [...selected, playerId] };
    });
  };


  const canStartMatch = () => {
    if (!selection.tossWinnerId || !selection.tossChoice) return false;
    if (selection.teamA.length !== playersPerSide) return false;
    if (selection.teamB.length !== playersPerSide) return false;
    return true;
  };

  const handleStartSubmit = async () => {
    if (!currentMatch) return;
    setStartLoading(true);
    setStartError('');

    try {
      await startMatch(currentMatch.id, {
        toss_winner_id: selection.tossWinnerId,
        toss_choice: selection.tossChoice,
        team1_player_ids: selection.teamA,
        team2_player_ids: selection.teamB,
      });
      const refreshed = await fetchMatches();
      setMatches(refreshed);
      setStartMatchId(null);
      setActiveTab('live');
      navigate(`/match/live/${currentMatch.id}`);
    } catch (error) {
      console.error('Failed to start match', error);
      setStartError(error.message || 'Failed to start match. Please verify toss and players.');
    } finally {
      setStartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8 lg:px-12">
        <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-orange-200/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-teal-200/70 blur-3xl" />
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="h-16 w-72 rounded-2xl bg-white/70 shadow-sm" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-56 rounded-3xl bg-white/70 shadow-sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8 lg:px-12">
      <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-orange-200/60 blur-3xl" />
      <div className="absolute top-24 -left-10 h-52 w-52 rounded-full bg-teal-200/60 blur-3xl" />
      <div className="absolute bottom-0 right-12 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Cricket Manager
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Matches Hub
            </h1>
            <p className="text-sm text-slate-600">
              Follow every over, trend, and highlight from your favorite matches.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
            <div className="relative w-full sm:w-72">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search teams or venues"
                className="w-full rounded-full border border-white/40 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none ring-0 transition focus:border-orange-300/60 focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/90 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:bg-white">
                <BellIcon className="h-5 w-5" />
              </button>
              <Link
                to="/match/create"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Create Match
              </Link>
            </div>
          </div>
        </header>

        <section className="sticky top-3 z-10 rounded-3xl border border-white/60 bg-white/80 p-2 shadow-sm backdrop-blur-xl">
          <div className="relative grid grid-cols-3 items-center text-sm font-medium text-slate-600">
            <div
              className="absolute bottom-0 left-0 h-0.5 w-1/3 rounded-full bg-orange-400 transition-transform duration-300"
              style={{ transform: `translateX(${tabIndex * 100}%)` }}
            />
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-3 py-3 transition ${
                  activeTab === tab.key
                    ? 'text-slate-900'
                    : 'hover:text-slate-800'
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {STATUS_TABS.find((tab) => tab.key === activeTab)?.label} Matches
            </h2>
            <p className="text-xs text-slate-500">
              {filteredMatches.length} matches
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onStart={normalizeStatus(match.status) === 'upcoming' ? () => handleOpenStart(match) : null}
              />
            ))}
          </div>

          {filteredMatches.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-300/70 bg-white/80 px-6 py-10 text-center text-slate-600 shadow-sm backdrop-blur">
              <div className="rounded-full bg-orange-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                No matches yet
              </div>
              <p className="max-w-sm text-sm">
                Looks quiet right now. Create a new match or switch tabs to follow another fixture.
              </p>
              <Link
                to="/match/create"
                className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Schedule a Match
              </Link>
            </div>
          )}
        </section>
      </div>

      {startMatchId && currentMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
          <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Start Match</p>
                <h3 className="text-lg font-semibold text-slate-900">{team1Name} vs {team2Name}</h3>
                <p className="text-xs text-slate-500">Select toss details and {playersPerSide} players per side.</p>
              </div>
              <button
                className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800"
                onClick={() => setStartMatchId(null)}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
              {startError && (
                <div className="rounded-2xl bg-red-50 text-red-700 text-sm px-4 py-3 border border-red-100">
                  {startError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField
                  label="Toss Winner"
                  name="tossWinnerId"
                  value={selection.tossWinnerId}
                  onChange={(e) => setSelection((prev) => ({ ...prev, tossWinnerId: e.target.value }))}
                  options={tossOptions}
                  placeholder="Select toss winner"
                />
                <SelectField
                  label="Toss Choice"
                  name="tossChoice"
                  value={selection.tossChoice}
                  onChange={(e) => setSelection((prev) => ({ ...prev, tossChoice: e.target.value }))}
                  options={[
                    { label: 'Bat', value: 'bat' },
                    { label: 'Bowl', value: 'bowl' },
                  ]}
                  placeholder="Select choice"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-900">{team1Name}</h4>
                    <span className="text-xs text-slate-500">{selection.teamA.length}/{playersPerSide}</span>
                  </div>
                  {startLoading ? (
                    <p className="text-sm text-slate-500">Loading players...</p>
                  ) : (
                    <div className="space-y-2">
                      {teamAPlayers.map((player) => (
                        <label key={player.id} className="flex items-center gap-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={selection.teamA.includes(player.id)}
                            onChange={() => togglePlayer('teamA', player.id)}
                          />
                          <span>{player.first_name ? `${player.first_name} ${player.last_name || ''}`.trim() : player.name || player.full_name || 'Player'}</span>
                        </label>
                      ))}
                      {!teamAPlayers.length && (
                        <p className="text-sm text-slate-500">No players found for this team.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-900">{team2Name}</h4>
                    <span className="text-xs text-slate-500">{selection.teamB.length}/{playersPerSide}</span>
                  </div>
                  {startLoading ? (
                    <p className="text-sm text-slate-500">Loading players...</p>
                  ) : (
                    <div className="space-y-2">
                      {teamBPlayers.map((player) => (
                        <label key={player.id} className="flex items-center gap-3 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={selection.teamB.includes(player.id)}
                            onChange={() => togglePlayer('teamB', player.id)}
                          />
                          <span>{player.first_name ? `${player.first_name} ${player.last_name || ''}`.trim() : player.name || player.full_name || 'Player'}</span>
                        </label>
                      ))}
                      {!teamBPlayers.length && (
                        <p className="text-sm text-slate-500">No players found for this team.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <button
                className="text-sm text-slate-500 hover:text-slate-800"
                onClick={() => setStartMatchId(null)}
              >
                Cancel
              </button>
              <button
                onClick={handleStartSubmit}
                disabled={!canStartMatch() || startLoading}
                className={`px-5 py-2 rounded-full text-sm font-semibold shadow transition ${
                  canStartMatch() && !startLoading
                    ? 'bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                }`}
              >
                {startLoading ? 'Starting...' : 'Start Match'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
