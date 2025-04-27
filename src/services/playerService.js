import { customFetch } from './customFetch';

export const fetchPlayers = async (searchTerm) => {
  return customFetch(`/players?${searchTerm ? `search=${searchTerm}` : ''}`);
};
export const fetchPlayerDetails = async (id) => {
  return customFetch(`/players/${id}`);
};

export const deletePlayer = async (id) => {
  return customFetch(`/players/${id}`, {
    method: 'DELETE',
  });
};

export const updatePlayer = (id, formNewData) => {
  return customFetch(`/players/${id}`, {
    method: 'PATCH',
    body: formNewData,
  });
};

export const createPlayer = (formNewData) => {
  return customFetch('/players', {
    method: 'POST',
    body: formNewData,
  });
};

