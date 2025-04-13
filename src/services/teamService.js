const API_BASE = 'http://localhost:3000/api/v1';

export const fetchTeams = async () => {
  const response = await fetch(`${API_BASE}/teams`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
  });
  return response.json();
};

export const fetchTeamDetails = async (id) => {
  const response = await fetch(`${API_BASE}/teams/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
  });
  return response.json();
};

export const createTeam = async (team) => {
  const response = await fetch(`${API_BASE}/teams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ team })
  });
  return response.json();
};

export const updateTeam = async (id, team) => {
  const response = await fetch(`${API_BASE}/teams/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ team })
  });
  return response.json();
};

export const deleteTeam = async (id) => {
  const response = await fetch(`${API_BASE}/teams/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  return response.json();
};