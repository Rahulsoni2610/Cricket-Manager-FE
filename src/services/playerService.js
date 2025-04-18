import { customFetch } from './customFetch';

export const fetchPlayers = async () => {
  return customFetch('/players');
};
// export const fetchPlayers = async (searchTerm = '') => {
//   const url = searchTerm 
//     ? `${API_BASE}/players?search=${encodeURIComponent(searchTerm)}`
//     : `${API_BASE}/players`;

//   const response = await fetch(url);
//   if (!response.ok) throw new Error('Failed to fetch players');
//   return await response.json();
// };

export const fetchPlayerDetails = async (id) => {
  return customFetch(`/players/${id}`);
};

// export const fetchPlayer = async (id) => {
//   const response = await fetch(`${API_BASE}/players/${id}`);
//   if (!response.ok) throw new Error('Failed to fetch player');
//   return await response.json();
// };



export const createPlayer = async (playerData) => {
  const response = await fetch(`${API_BASE}/players`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
    },
    body: JSON.stringify({ player: playerData })
  });
  if (!response.ok) throw new Error('Failed to create player');
  return await response.json();
};

export const updatePlayer = async (id, playerData) => {
  const response = await fetch(`${API_BASE}/players/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
    },
    body: JSON.stringify({ player: playerData })
  });
  if (!response.ok) throw new Error('Failed to update player');
  return await response.json();
};

export const deletePlayer = async (id) => {
  const response = await fetch(`${API_BASE}/players/${id}`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
    }
  });
  if (!response.ok) throw new Error('Failed to delete player');
  return true;
};