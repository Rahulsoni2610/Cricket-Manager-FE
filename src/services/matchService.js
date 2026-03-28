import { customFetch } from './customFetch';

export const fetchMatches = async () => {
  return customFetch('/matches');
};

export const createMatch = async (match) => {
  return customFetch('/matches', {
    method: 'POST',
    body: JSON.stringify({ match }),
  });
};

export const startMatch = async (matchId, payload) => {
  return customFetch(`/matches/${matchId}/start`, {
    method: 'POST',
    body: JSON.stringify({ match: payload }),
  });
};

export const fetchMatchState = async (id) => {
  return customFetch(`/matches/${id}`);
};

export const scoreBall = async (matchId, data) => {
  return customFetch(`/matches/${matchId}/score`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const initializeInning = async (matchId, data) => {
  return customFetch(`/matches/${matchId}/initialize_inning`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const startNextOver = async (matchId, bowlerId) => {
  return customFetch(`/matches/${matchId}/overs`, {
    method: 'POST',
    body: JSON.stringify({ bowler_id: bowlerId }),
  });
};

export const undoLastBall = async (matchId) => {
  return customFetch(`/matches/${matchId}/undo`, {
    method: 'POST',
  });
};

export const addBatsman = async (matchId, inningId, playerId) => {
  return customFetch(`/matches/${matchId}/innings/${inningId}/add_batsman`, {
    method: 'POST',
    body: JSON.stringify({ player_id: playerId }),
  });
};
