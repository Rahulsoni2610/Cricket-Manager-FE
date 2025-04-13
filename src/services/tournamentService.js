const API_BASE = 'http://localhost:3000/api/v1';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const fetchTournaments = async () => {
  const response = await fetch(`${API_BASE}/tournaments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
  });
  return handleResponse(response);
};
export const createTournament = async (tournament) => {
  const response = await fetch(`${API_BASE}/tournaments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ tournament })
  });
  return handleResponse(response);
};

export const updateTournament = async (id, tournament) => {
  const response = await fetch(`${API_BASE}/tournaments/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ tournament })
  });
  return handleResponse(response);
};

export const deleteTournament = async (id) => {
  const response = await fetch(`${API_BASE}/tournaments/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  });
  return handleResponse(response);
};