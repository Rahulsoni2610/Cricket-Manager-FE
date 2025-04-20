import { customFetch } from './customFetch';

export const fetchPlayers = async () => {
  return customFetch('/players');
};
export const fetchPlayerDetails = async (id) => {
  return customFetch(`/players/${id}`);
};

export const createPlayer = async (playerData) => {
  return customFetch('/players', {
    method: 'POST',
    body: JSON.stringify({ player: playerData }),
  });
};

export const updatePlayer = async (id, playerData) => {
  return customFetch(`/players/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ player: playerData }),
  })
}

export const deletePlayer = async (id) => {
  return customFetch(`/players/${id}`, {
    method: 'DELETE',
  });
};

