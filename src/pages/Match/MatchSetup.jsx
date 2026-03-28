import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectField from '../../components/SelectField';
import InputField from '../../components/InputField';
import { fetchTeams } from '../../services/teamService';
import { createMatch } from '../../services/matchService';

const MATCH_TYPES = [
  { label: 'Friendly', value: 'friendly' },
  { label: 'Tournament', value: 'tournament' },
  { label: 'League', value: 'league' },
];

const MatchSetup = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    venue: '',
    matchDate: '',
    matchType: 'friendly',
    playersPerSide: 11,
    overs: 20,
    teamA: '',
    teamB: ''
  });

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchTeams();
        setTeams(data);
      } catch (error) {
        console.error('Failed to load teams', error);
      } finally {
        setLoading(false);
      }
    };
    loadTeams();
  }, []);

  const teamOptions = useMemo(
    () => (teams || [])
      .map((team) => ({
        label: team.name ?? team.label ?? String(team.id ?? team.value ?? ''),
        value: team.id ?? team.value,
      }))
      .filter((team) => team.value !== undefined && team.value !== null),
    [teams]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'teamA' || name === 'teamB') {
        if (next.teamA === next.teamB) {
          next.teamB = name === 'teamA' ? '' : next.teamB;
        }
      }
      return next;
    });
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const errors = useMemo(() => {
    const next = {};
    if (!formData.venue.trim()) next.venue = 'Match location is required.';
    if (!formData.matchDate) next.matchDate = 'Match date & time is required.';
    if (!formData.playersPerSide || Number(formData.playersPerSide) <= 0) next.playersPerSide = 'Players per side must be greater than 0.';
    if (!formData.overs || Number(formData.overs) <= 0) next.overs = 'Overs must be greater than 0.';
    if (!formData.teamA) next.teamA = 'Select Team A.';
    if (!formData.teamB) next.teamB = 'Select Team B.';
    if (formData.teamA && formData.teamB && formData.teamA === formData.teamB) next.teamB = 'Teams must be different.';

    return next;
  }, [formData]);

  const showError = (field) => (submitted || touched[field]) && errors[field];
  const isFormValid = Object.keys(errors).length === 0;

  const handleStartMatch = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isFormValid) return;

    try {
      const matchPayload = {
        venue: formData.venue.trim(),
        match_date: formData.matchDate,
        players_per_side: Number(formData.playersPerSide),
        match_type: formData.matchType,
        team1_id: formData.teamA,
        team2_id: formData.teamB,
        overs: Number(formData.overs),
      };

      const response = await createMatch(matchPayload);
      const newMatchId = response.id;

      if (newMatchId) {
        navigate('/matches');
      } else {
        alert('Failed to create match: Invalid response');
      }
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Failed to create match. See console.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading teams...</div>;

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 md:px-8 lg:px-12">
      <div className="absolute -top-24 right-0 h-64 w-64 rounded-full bg-orange-200/60 blur-3xl" />
      <div className="absolute top-24 -left-10 h-52 w-52 rounded-full bg-teal-200/60 blur-3xl" />
      <div className="absolute bottom-0 right-12 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <div className="flex flex-col gap-2 mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Match Center</p>
          <h1 className="text-3xl font-semibold text-slate-900">Create Match</h1>
          <p className="text-sm text-slate-600">Capture all match details upfront for a smooth kickoff.</p>
        </div>

        <form onSubmit={handleStartMatch} className="space-y-8">
          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Match Location"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Stadium / Ground"
                required
                error={showError('venue')}
              />
              <InputField
                label="Date & Time"
                name="matchDate"
                type="datetime-local"
                value={formData.matchDate}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                error={showError('matchDate')}
              />
              <SelectField
                label="Match Type"
                name="matchType"
                value={formData.matchType}
                onChange={handleChange}
                options={MATCH_TYPES}
                helper="Choose the context for this match."
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Format</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Players per Side"
                name="playersPerSide"
                type="number"
                value={formData.playersPerSide}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                min={1}
                helper="Standard cricket uses 11 players per team."
                error={showError('playersPerSide')}
              />
              <InputField
                label="Maximum Overs"
                name="overs"
                type="number"
                value={formData.overs}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                min={1}
                helper="Limited overs per innings."
                error={showError('overs')}
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField
                label="Team A"
                name="teamA"
                value={formData.teamA}
                onChange={handleChange}
                onBlur={handleBlur}
                options={teamOptions}
                placeholder="Select Team A"
                error={showError('teamA')}
              />
              <SelectField
                label="Team B"
                name="teamB"
                value={formData.teamB}
                onChange={handleChange}
                onBlur={handleBlur}
                options={teamOptions.filter((team) => team.value !== formData.teamA)}
                placeholder="Select Team B"
                error={showError('teamB')}
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 px-4 rounded-xl text-sm font-semibold shadow-lg transition ${
              isFormValid
                ? 'bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            Create Match
          </button>
        </form>
      </div>
    </div>
  );
};

export default MatchSetup;
