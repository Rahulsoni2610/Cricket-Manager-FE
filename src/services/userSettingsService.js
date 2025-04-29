import { customFetch } from './customFetch';

export const fetchUsers = async () => {
  return customFetch('/users');
};

export const fetchUser = async (id) => {
  return customFetch(`/users/${id}`);
}

export const updateUser = async (id, user) => {
  return customFetch(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ user }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const deleteUser = async (id) => {
  return customFetch(`/users/${id}`, {
    method: 'DELETE',
  });
}

export const fetchUserSettings = async (userId) => {
  return customFetch(`/users/${userId}/settings`);
};
export const updateUserSettings = async (userId, settings) => {
  return customFetch(`/users/${userId}/settings`, {
    method: 'PATCH',
    body: JSON.stringify({ settings }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const deleteUserSettings = async (userId) => {
  return customFetch(`/users/${userId}/settings`, {
    method: 'DELETE',
  });
};
export const fetchUserSettingsByTournament = async (userId, tournamentId) => {
  return customFetch(`/users/${userId}/settings?tournament_id=${tournamentId}`);
};