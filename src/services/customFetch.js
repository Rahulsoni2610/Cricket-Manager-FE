const API_BASE = 'https://largely-powder-semester-scholarship.trycloudflare.com/api/v1';

export const customFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    return;
  }

  if (!response.ok) {
    const errorBody = await response.json();
    throw new Error(errorBody.message || errorBody.error || JSON.stringify(errorBody) || 'Something went wrong');
  }

  return response.json();
};
