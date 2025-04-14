import { customFetch } from './customFetch';

export const fetchTeams = async () => {
  return customFetch('/teams');
};

export const fetchTeamDetails = async (id) => {
  return customFetch(`/teams/${id}`);
};

export const createTeam = async (team) => {
  return customFetch('/teams', {
    method: 'POST',
    body: JSON.stringify({ team }),
  });
};

export const updateTeam = async (id, team) => {
  return customFetch(`/teams/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ team }),
  });
};

export const deleteTeam = async (id) => {
  return customFetch(`/teams/${id}`, {
    method: 'DELETE',
  });
};
