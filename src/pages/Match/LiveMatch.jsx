import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { customFetch } from '../../services/customFetch';
import {
  fetchMatchState,
  scoreBall,
  initializeInning,
  startNextOver,
  undoLastBall,
  addBatsman
} from '../../services/matchService';

const RUN_OPTIONS = [0, 1, 2, 3, 4, 6];
const EXTRA_BUTTONS = [
  { label: 'Wide', value: 'wide' },
  { label: 'No-ball', value: 'no_ball' },
  { label: 'Bye', value: 'bye' },
  { label: 'Leg-bye', value: 'leg_bye' },
];

const playerLabel = (player) => {
  if (!player) return 'Player';
  if (player.name) return player.name;
  if (player.full_name) return player.full_name;
  const first = player.first_name || '';
  const last = player.last_name || '';
  return `${first} ${last}`.trim() || 'Player';
};

const LiveMatch = () => {
  const { id: matchId } = useParams();
  const navigate = useNavigate();

  const [matchState, setMatchState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [showPlayerSelection, setShowPlayerSelection] = useState(false);
  const [selectionData, setSelectionData] = useState({ strikerId: '', nonStrikerId: '', bowlerId: '' });
  const [lastTeamIds, setLastTeamIds] = useState({ battingId: null, bowlingId: null });

  const [selectedRuns, setSelectedRuns] = useState(0);
  const [showExtraModal, setShowExtraModal] = useState(false);
  const [selectedExtraType, setSelectedExtraType] = useState('');
  const [selectedExtraRuns, setSelectedExtraRuns] = useState(0);
  const [extraOffBat, setExtraOffBat] = useState(true);

  const [showWicketModal, setShowWicketModal] = useState(false);
  const [selectedHowOut, setSelectedHowOut] = useState('');
  const [selectedFielder, setSelectedFielder] = useState('');
  const [newBatsmanId, setNewBatsmanId] = useState('');

  const [showOverModal, setShowOverModal] = useState(false);
  const [selectedBowler, setSelectedBowler] = useState('');

  const [showAddBatsmanModal, setShowAddBatsmanModal] = useState(false);
  const [addBatsmanId, setAddBatsmanId] = useState('');

  const loadMatchState = async () => {
    try {
      const data = await fetchMatchState(matchId);
      setMatchState(data);
      setError(null);
    } catch (e) {
      console.error('Failed to load match state', e);
      setError(e.message || 'Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatchState();
  }, [matchId]);

  useEffect(() => {
    if (matchState?.status === 'completed') {
      navigate('/match/scorecard/' + matchId, { replace: true });
    }
  }, [matchState?.status, matchId, navigate]);

  useEffect(() => {
    if (matchState && ((!matchState.batsmen || matchState.batsmen.length < 2) || !matchState.bowler) && !matchState.new_batsman_required) {
      setShowPlayerSelection(true);
    } else {
      setShowPlayerSelection(false);
    }

    if (matchState?.batting_team?.id && matchState?.bowling_team?.id) {
      if (
        lastTeamIds.battingId !== matchState.batting_team.id ||
        lastTeamIds.bowlingId !== matchState.bowling_team.id
      ) {
        setTeamAPlayers([]);
        setTeamBPlayers([]);
        setSelectionData({ strikerId: '', nonStrikerId: '', bowlerId: '' });
        setLastTeamIds({ battingId: matchState.batting_team.id, bowlingId: matchState.bowling_team.id });
      }
    }

    if (matchState) {
      loadTeamPlayers();
    }

    if (matchState?.new_batsman_required) {
      setShowAddBatsmanModal(true);
    }

    if (matchState?.over_complete && !matchState?.inning_complete && matchState?.status === 'live') {
      setShowOverModal(true);
    }
  }, [matchState]);

  const loadTeamPlayers = async () => {
    if (!matchState || !matchState.batting_team || !matchState.bowling_team) return;

    const playingXi = matchState.playing_xi;
    if (playingXi && (playingXi.team1?.length || playingXi.team2?.length)) {
      const batTeamId = matchState.batting_team.id;
      const bowlTeamId = matchState.bowling_team.id;
      const batPlayers = batTeamId === matchState.team1?.id ? playingXi.team1 : playingXi.team2;
      const bowlPlayers = bowlTeamId === matchState.team1?.id ? playingXi.team1 : playingXi.team2;

      if (batPlayers?.length) setTeamAPlayers(batPlayers);
      if (bowlPlayers?.length) setTeamBPlayers(bowlPlayers);
      return;
    }

    if (teamAPlayers.length > 0 && teamBPlayers.length > 0) return;

    try {
      const batPlayers = await customFetch(`/teams/${matchState.batting_team.id}/players`);
      const bowlPlayers = await customFetch(`/teams/${matchState.bowling_team.id}/players`);
      setTeamAPlayers(batPlayers);
      setTeamBPlayers(bowlPlayers);
    } catch (e) {
      console.error('Failed to load players', e);
    }
  };

  const handleSelectionSubmit = async (e) => {
    e.preventDefault();
    if (selectionData.strikerId === selectionData.nonStrikerId) {
      alert('Striker and Non-Striker must be different');
      return;
    }

    try {
      await initializeInning(matchId, {
        striker_id: selectionData.strikerId,
        non_striker_id: selectionData.nonStrikerId,
        bowler_id: selectionData.bowlerId
      });
      loadMatchState();
    } catch (e) {
      alert('Initialization failed: ' + e.message);
    }
  };

  const handleScore = async (runsOverride) => {
    if (matchState?.status === 'completed') return;
    if (matchState?.inning_complete) {
      alert('Innings complete. Start the next innings.');
      return;
    }
    if (matchState?.new_batsman_required) {
      setShowAddBatsmanModal(true);
      return;
    }
    if (matchState?.over_complete) {
      setShowOverModal(true);
      return;
    }
    const striker = matchState?.batsmen?.find((b) => b.on_strike) || matchState?.batsmen?.[0];
    if (!striker || !matchState?.bowler) {
      setShowPlayerSelection(true);
      return;
    }

    const runs = typeof runsOverride === 'number' ? runsOverride : selectedRuns;

    try {
      await scoreBall(matchId, {
        runs: runs,
        extra_type: null,
        is_wicket: false,
        batsman_id: striker.id,
        bowler_id: matchState.bowler.id,
        is_bye: false,
      });
      setSelectedRuns(0);
      loadMatchState();
    } catch (e) {
      alert('Scoring failed: ' + e.message);
    }
  };

  const handleExtraScore = async () => {
    if (matchState?.status === 'completed') return;
    if (matchState?.inning_complete) {
      alert('Innings complete. Start the next innings.');
      return;
    }
    if (matchState?.new_batsman_required) {
      setShowAddBatsmanModal(true);
      return;
    }
    if (matchState?.over_complete) {
      setShowOverModal(true);
      return;
    }
    const striker = matchState?.batsmen?.find((b) => b.on_strike) || matchState?.batsmen?.[0];
    if (!striker || !matchState?.bowler) {
      setShowPlayerSelection(true);
      return;
    }

    try {
      await scoreBall(matchId, {
        runs: selectedExtraRuns,
        extra_type: selectedExtraType,
        is_wicket: false,
        batsman_id: striker.id,
        bowler_id: matchState.bowler.id,
        is_bye: selectedExtraType === 'no_ball' ? !extraOffBat : false,
      });
      setSelectedExtraRuns(0);
      setSelectedExtraType('');
      setExtraOffBat(true);
      setShowExtraModal(false);
      loadMatchState();
    } catch (e) {
      alert('Scoring failed: ' + e.message);
    }
  };

  const handleWicket = async () => {
    const striker = matchState?.batsmen?.find((b) => b.on_strike) || matchState?.batsmen?.[0];
    if (!striker || !matchState?.bowler) {
      setShowPlayerSelection(true);
      return;
    }
    if (!selectedHowOut) {
      alert('Please select how out');
      return;
    }
    if (selectedHowOut === 'caught' && !selectedFielder) {
      alert('Please select a fielder for caught');
      return;
    }

    try {
      await scoreBall(matchId, {
        runs: 0,
        extra_type: null,
        is_wicket: true,
        batsman_id: striker.id,
        bowler_id: matchState.bowler.id,
        how_out: selectedHowOut,
        fielder_id: selectedFielder || null,
        new_batsman_id: newBatsmanId || null,
      });
      setShowWicketModal(false);
      setSelectedHowOut('');
      setSelectedFielder('');
      setNewBatsmanId('');
      loadMatchState();
    } catch (e) {
      alert('Wicket failed: ' + e.message);
    }
  };

  const handleUndo = async () => {
    try {
      await undoLastBall(matchId);
      loadMatchState();
    } catch (e) {
      alert('Undo failed: ' + e.message);
    }
  };

  const handleStartOver = async () => {
    if (!selectedBowler) {
      alert('Please select a bowler');
      return;
    }
    try {
      await startNextOver(matchId, selectedBowler);
      setShowOverModal(false);
      setSelectedBowler('');
      loadMatchState();
    } catch (e) {
      alert('Failed to start over: ' + e.message);
    }
  };

  const handleAddBatsman = async () => {
    try {
      const inningId = matchState.current_inning?.id || matchState.current_inning_id;
      if (!inningId) {
        alert('Inning not initialized');
        return;
      }
      await addBatsman(matchId, inningId, addBatsmanId);
      setShowAddBatsmanModal(false);
      setAddBatsmanId('');
      loadMatchState();
    } catch (e) {
      alert('Failed to add batsman: ' + e.message);
    }
  };

  const oversLabel = matchState?.match_header
    ? `${matchState.match_header.overs}.${matchState.match_header.balls}`
    : (matchState?.current_inning ? `${matchState.current_inning.overs}` : '0.0');
  const inningRuns = matchState?.match_header?.score ?? (matchState?.current_inning?.total_runs ?? 0);
  const inningWickets = matchState?.match_header?.wickets ?? (matchState?.current_inning?.total_wickets ?? 0);

  const striker = matchState?.batsmen?.find((b) => b.on_strike) || matchState?.batsmen?.[0];
  const nonStriker = matchState?.batsmen?.find((b) => !b.on_strike) || matchState?.batsmen?.[1];

  if (loading) return <div className="p-8 text-center text-slate-600">Loading match...</div>;
  if (!matchState) return <div className="p-8 text-center text-red-500">Match not found</div>;

  if (matchState.new_batsman_required) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Wicket Fall! Select New Batsman</h2>
          <p className="text-sm text-slate-600">A new batsman is required to continue.</p>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            value={addBatsmanId}
            onChange={(e) => setAddBatsmanId(e.target.value)}
          >
            <option value="">Select Batsman</option>
            {teamAPlayers.filter(p =>
              !matchState.batsmen.find(b => b.id === p.id) &&
              !(matchState.out_player_ids || []).includes(p.id)
            ).map(p => (
              <option key={p.id} value={p.id}>{playerLabel(p)}</option>
            ))}
          </select>
          <div className="flex items-center justify-between">
            <button onClick={() => setAddBatsmanId('')} className="text-sm text-slate-500">Clear</button>
            <button onClick={handleAddBatsman} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Send to Crease</button>
          </div>
        </div>
      </div>
    );
  }

  if (showPlayerSelection) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
        <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Opening Setup</p>
            <h2 className="text-2xl font-semibold text-slate-900">Select Opening Players</h2>
            <p className="text-sm text-slate-600 mt-2">Choose the opening pair and the first bowler to begin the innings.</p>
          </div>
          <form onSubmit={handleSelectionSubmit} className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Striker ({matchState.batting_team.name})</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  value={selectionData.strikerId}
                  onChange={(e) => setSelectionData({ ...selectionData, strikerId: e.target.value })}
                  required
                >
                  <option value="">Select Striker</option>
                  {teamAPlayers.map(p => (
                    <option key={p.id} value={p.id}>{playerLabel(p)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Non-Striker ({matchState.batting_team.name})</label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                  value={selectionData.nonStrikerId}
                  onChange={(e) => setSelectionData({ ...selectionData, nonStrikerId: e.target.value })}
                  required
                >
                  <option value="">Select Non-Striker</option>
                  {teamAPlayers
                    .filter(p => String(p.id) !== String(selectionData.strikerId))
                    .map(p => (
                      <option key={p.id} value={p.id}>{playerLabel(p)}</option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Opening Bowler ({matchState.bowling_team.name})</label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                value={selectionData.bowlerId}
                onChange={(e) => setSelectionData({ ...selectionData, bowlerId: e.target.value })}
                required
              >
                <option value="">Select Bowler</option>
                {teamBPlayers.map(p => (
                  <option key={p.id} value={p.id}>{playerLabel(p)}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">You can update batsmen or bowler later during the match.</p>
              <button
                type="submit"
                className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Start Inning
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8 lg:px-12">
      <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-orange-200/60 blur-3xl" />
      <div className="absolute top-24 -left-10 h-52 w-52 rounded-full bg-teal-200/60 blur-3xl" />
      <div className="absolute bottom-0 right-12 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live Match</p>
              <h1 className="text-2xl font-semibold text-slate-900">{matchState.team1?.name} vs {matchState.team2?.name}</h1>
              <p className="text-sm text-slate-600">{matchState.venue} · {oversLabel} overs</p>
            </div>
            {matchState.chase && (
              <div className="text-xs text-slate-600">
                Target: {matchState.chase.target} | R: {matchState.chase.runs_remaining} | B: {matchState.chase.balls_remaining} | RRR: {matchState.chase.required_run_rate}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Score</p>
                  <h2 className="text-3xl font-semibold text-slate-900">{inningRuns}/{inningWickets}</h2>
                  <p className="text-sm text-slate-600">Overs: {oversLabel}</p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div>Striker: {striker?.name || '-'}</div>
                  <div>Non-Striker: {nonStriker?.name || '-'}</div>
                  <div>Bowler: {matchState.bowler?.name || '-'}</div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Score Ball</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {RUN_OPTIONS.map((runs) => (
                  <button
                    key={runs}
                    onClick={() => {
                      setSelectedRuns(runs);
                      if (!matchState?.new_batsman_required && !matchState?.over_complete && !matchState?.inning_complete) {
                        handleScore(runs);
                      }
                    }}
                    className={`py-2 rounded-xl text-sm font-semibold ${selectedRuns === runs ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                  >
                    {runs}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Extras</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {EXTRA_BUTTONS.map((extra) => (
                    <button
                      key={extra.value}
                      onClick={() => {
                        if (matchState?.new_batsman_required || matchState?.over_complete || matchState?.inning_complete) {
                          return;
                        }
                        setSelectedExtraType(extra.value);
                        setSelectedExtraRuns(0);
                        setExtraOffBat(true);
                        setShowExtraModal(true);
                      }}
                      className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-700 transition hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      {extra.label}
                    </button>
                  ))}
                </div>
              </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setShowWicketModal(true)} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700">Wicket</button>
              <button onClick={handleUndo} className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700">Undo</button>
            </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live Summary</p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between">
                  <span>{matchState?.bowler?.name || 'Bowler'} to {striker?.name || 'Batsman'}</span>
                  <span className="font-semibold">{(matchState.current_over || []).slice(-1)[0] || '-'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(matchState.current_over || []).slice(-6).map((ball, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                      {ball}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Scorecards</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                {(matchState.innings || []).map((inning) => (
                  <div key={inning.id} className="flex items-center justify-between">
                    <span>{inning.batting_team?.name || 'Team'} {inning.number}</span>
                    <span className="font-semibold">{inning.total_runs}/{inning.total_wickets} ({inning.overs}.{inning.balls})</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Batting</p>
              <div className="space-y-3 mt-4">
                {(matchState.batsmen || []).map((batsman) => (
                  <div key={batsman.id} className={`flex justify-between items-center text-sm ${batsman.on_strike ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}>
                    <span>{batsman.name}{batsman.on_strike ? ' ★' : ''}</span>
                    <span className="font-mono">{batsman.runs} ({batsman.balls})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bowler</p>
              <div className="mt-4 text-sm text-slate-700">
                {matchState.bowler ? (
                  <div className="flex justify-between">
                    <span>{matchState.bowler.name}</span>
                    <span className="font-mono">{matchState.bowler.overs} ov</span>
                  </div>
                ) : (
                  <p>No bowler selected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showWicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Wicket Details</h3>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={selectedHowOut}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedHowOut(value);
                if (value !== 'caught') {
                  setSelectedFielder('');
                }
              }}
            >
              <option value="">Select How Out</option>
              <option value="bowled">Bowled</option>
              <option value="caught">Caught</option>
              <option value="lbw">LBW</option>
              <option value="run_out">Run Out</option>
            </select>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              value={selectedFielder}
              onChange={(e) => setSelectedFielder(e.target.value)}
              disabled={selectedHowOut !== 'caught'}
            >
              <option value="">{selectedHowOut === 'caught' ? 'Select Fielder (required)' : 'Select Fielder (not needed)'}</option>
              {teamBPlayers.map((p) => (
                <option key={p.id} value={p.id}>{playerLabel(p)}</option>
              ))}
            </select>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={newBatsmanId} onChange={(e) => setNewBatsmanId(e.target.value)}>
              <option value="">Select New Batsman</option>
              {teamAPlayers.filter(p =>
                !matchState.batsmen.find(b => b.id === p.id) &&
                !(matchState.out_player_ids || []).includes(p.id)
              ).map(p => (
                <option key={p.id} value={p.id}>{playerLabel(p)}</option>
              ))}
            </select>
            <div className="flex items-center justify-between">
              <button onClick={() => setShowWicketModal(false)} className="text-sm text-slate-500">Cancel</button>
              <button onClick={handleWicket} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Confirm Wicket</button>
            </div>
          </div>
        </div>
      )}

      {showOverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Start Next Over</h3>
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={selectedBowler} onChange={(e) => setSelectedBowler(e.target.value)}>
              <option value="">Select Bowler</option>
              {teamBPlayers
                .filter((p) => String(p.id) !== String(matchState?.bowler?.id))
                .map((p) => (
                <option key={p.id} value={p.id}>{playerLabel(p)}</option>
              ))}
            </select>
            <div className="flex items-center justify-between">
              <button onClick={() => setShowOverModal(false)} className="text-sm text-slate-500">Cancel</button>
              <button onClick={handleStartOver} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Start Over</button>
            </div>
          </div>
        </div>
      )}

      {showAddBatsmanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Add Batsman</h3>
            {matchState?.new_batsman_required && (
              <p className="text-sm text-slate-500">A new batsman is required to continue.</p>
            )}
            <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={addBatsmanId} onChange={(e) => setAddBatsmanId(e.target.value)}>
              <option value="">Select Batsman</option>
              {teamAPlayers
                .filter(p =>
                  !matchState.batsmen.find(b => b.id === p.id) &&
                  !(matchState.out_player_ids || []).includes(p.id)
                )
                .map((p) => (
                  <option key={p.id} value={p.id}>{playerLabel(p)}</option>
                ))}
            </select>
            <div className="flex items-center justify-between">
              <button onClick={() => setShowAddBatsmanModal(false)} className="text-sm text-slate-500">Cancel</button>
              <button onClick={handleAddBatsman} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">Add</button>
            </div>
          </div>
        </div>
      )}

      {showExtraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
          <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Extras</p>
              <h3 className="text-lg font-semibold text-slate-900">{EXTRA_BUTTONS.find(b => b.value === selectedExtraType)?.label || 'Extra'} Runs</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {RUN_OPTIONS.map((runs) => (
                <button
                  key={runs}
                  onClick={() => setSelectedExtraRuns(runs)}
                  className={`rounded-xl py-2 text-sm font-semibold ${selectedExtraRuns === runs ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                >
                  {runs}
                </button>
              ))}
            </div>
            {selectedExtraType === 'no_ball' && (
              <div className="flex items-center justify-between rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm text-slate-700">
                <div>
                  <p className="font-semibold text-slate-800">Runs off the bat?</p>
                  <p className="text-xs text-slate-500">Choose if the runs should count to the batsman.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setExtraOffBat((prev) => !prev)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold ${extraOffBat ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
                >
                  {extraOffBat ? 'Off Bat' : 'Byes'}
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <button onClick={() => setShowExtraModal(false)} className="text-sm text-slate-500">Cancel</button>
              <button onClick={handleExtraScore} className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
                Add Extra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMatch;
