// customFetch.js
const API_BASE = 'http://localhost:3000/api/v1';

export const customFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Accept': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};
