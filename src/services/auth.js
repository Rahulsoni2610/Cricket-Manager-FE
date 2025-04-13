const API_URL = 'http://127.0.0.1:3000/api/v1'; // Using 127.0.0.1 instead of localhost

export const login = async (email, password) => {
  console.log('Attempting to login to:', API_URL); // Debug log

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        user: { email, password }
      }),
      credentials: 'include',
      mode: 'cors' // Explicitly enable CORS
    });

    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Full error details:', error); // Detailed error log
    if (error.message.toLowerCase().includes('failed to fetch')) {
      throw new Error(`Connection failed. Please check:
      1. Backend is running on port 3000
      2. No browser extensions blocking requests
      3. Try in Incognito mode`);
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};


export const register = async (userData) => {
  // Implementation depends on your backend
};