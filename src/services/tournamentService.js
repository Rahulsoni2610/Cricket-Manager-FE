import { customFetch } from './customFetch';

export const fetchTournaments = async () => {
  return customFetch('/tournaments');
};

export const createTournament = async (tournament) => {
  return customFetch('/tournaments', {
    method: 'POST',
    body: JSON.stringify({ tournament }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateTournament = async (id, tournament) => {
  return customFetch(`/tournaments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ tournament }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteTournament = async (id) => {
  return customFetch(`/tournaments/${id}`, {
    method: 'DELETE',
  });
};
