import { CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const normalizeStatus = (status) => {
  const value = (status || 'upcoming').toLowerCase();
  if (value === 'paused') return 'live';
  if (value === 'completed') return 'completed';
  if (value === 'live') return 'live';
  return 'upcoming';
};

const getInitials = (name) => {
  if (!name) return 'TBD';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

const formatDate = (value) => {
  if (!value) return 'Schedule pending';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Schedule pending';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
};

const MatchCard = ({ match, onStart }) => {
  const status = normalizeStatus(match.status);
  const isLive = status === 'live';
  const isCompleted = status === 'completed';
  const isUpcoming = status === 'upcoming';

  const team1Name = match.team1?.name || match.team1_name || (typeof match.team1 === 'string' ? match.team1 : null) || 'TBD';
  const team2Name = match.team2?.name || match.team2_name || (typeof match.team2 === 'string' ? match.team2 : null) || 'TBD';

  const statusConfig = {
    live: {
      label: 'LIVE',
      badge: 'bg-red-500/90 text-white',
      glow: 'shadow-red-500/30',
      strip: 'from-red-500/80 to-orange-400/80'
    },
    upcoming: {
      label: 'UPCOMING',
      badge: 'bg-blue-500/90 text-white',
      glow: 'shadow-blue-500/30',
      strip: 'from-blue-500/80 to-sky-400/80'
    },
    completed: {
      label: 'COMPLETED',
      badge: 'bg-emerald-500/90 text-white',
      glow: 'shadow-emerald-500/30',
      strip: 'from-emerald-500/80 to-lime-400/80'
    }
  };

  const statusStyle = statusConfig[status];
  const matchDate = formatDate(match.match_date || match.date);
  const matchTime = formatTime(match.match_date || match.date);

  const team1Score = match.team1_score || match.team1Score || '-';
  const team2Score = match.team2_score || match.team2Score || '-';

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl">
      <div className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${statusStyle.strip}`} />

      <div
        className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.2em] ${statusStyle.badge} ${statusStyle.glow}`}
      >
        {statusStyle.label}
      </div>

      {isLive && (
        <div className="absolute left-5 top-5 flex items-center gap-2 text-xs font-semibold text-red-500">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Live now
        </div>
      )}

      <div className="flex flex-col gap-6 px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-base font-semibold text-slate-800 shadow-sm">
              {getInitials(team1Name)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {team1Name}
              </p>
              {(isLive || isCompleted) && (
                <p className="text-xs font-semibold text-slate-600">
                  {team1Score}
                </p>
              )}
            </div>
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">vs</div>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-right text-sm font-semibold text-slate-900">
                {team2Name}
              </p>
              {(isLive || isCompleted) && (
                <p className="text-right text-xs font-semibold text-slate-600">
                  {team2Score}
                </p>
              )}
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-base font-semibold text-slate-800 shadow-sm">
              {getInitials(team2Name)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/50 pt-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-orange-400" />
            <span>
              {matchDate}
              {matchTime ? ` · ${matchTime}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-orange-400" />
            <span className="truncate max-w-[160px]">{match.venue || 'Venue TBD'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-slate-500">
            {isCompleted ? 'Final result posted' : isLive ? 'Streaming live updates' : 'Scheduled fixture'}
          </div>
          <div className="flex items-center gap-2">
            {isUpcoming && onStart && (
              <button
                onClick={onStart}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 hover:border-slate-300 hover:text-slate-900"
              >
                Start
              </button>
            )}
            <Link
              to={isCompleted ? `/match/scorecard/${match.id}` : `/match/live/${match.id}`}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              {isLive ? 'Follow Match' : 'View Details'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
