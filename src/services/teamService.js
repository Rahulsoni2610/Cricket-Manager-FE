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
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export const deleteTeam = async (id) => {
  return customFetch(`/teams/${id}`, {
    method: 'DELETE',
  });
};

export const fetchTeamPlayers = async (teamId, tournamentId) => {
  return customFetch(
    `/teams/${teamId}/players?tournament_id=${tournamentId}`
  );
};

export const fetchAvailablePlayers = async (teamId, tournamentId) => {
  return customFetch(
    `/players/available?team_id=${teamId}&tournament_id=${tournamentId}`
  );
};

export const addPlayersToTeam = async (teamId, tournamentId, playerIds) => {
  return customFetch('/team_tournament_players', {
    method: 'POST',
    body: JSON.stringify({
      team_id: teamId,
      tournament_id: tournamentId,
      player_ids: Array.isArray(playerIds) ? playerIds : [playerIds],
    }),
  });
};

export const removePlayerFromTeam = async (teamId, tournamentId, playerId) => {
  return customFetch('/team_tournament_players', {
    method: 'DELETE',
    body: JSON.stringify({
      team_id: teamId,
      tournament_id: tournamentId,
      player_id: playerId,
    }),
  });
};

export const assignTeamRoles = async (teamId, { captain_id, vice_captain_id }) => {
  return customFetch(`/teams/${teamId}/roles`, {
    method: 'PATCH',
    body: JSON.stringify({
      captain_id,
      vice_captain_id,
    }),
  });
};

// Tournament-related (could also move to tournamentService.js)
export const fetchTournaments = async () => {
  return customFetch('/tournaments');
};

export const saveSquad = async (teamId, tournamentId, playerIds) => {
  await customFetch('/team_tournament_players', {
    method: 'POST',
    body: JSON.stringify({
      team_id: teamId,
      tournament_id: tournamentId,
      player_ids: playerIds,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};