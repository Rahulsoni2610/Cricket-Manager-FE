const API_BASE = 'http://localhost:3000/api/v1';

export const fetchMatches = async () => {
  const response = await fetch(`${API_BASE}/matches`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
  });
  return response.json();
};

export const createMatch = async (match) => {
  const response = await fetch(`${API_BASE}/matches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify({ match })
  });
  return response.json();
};