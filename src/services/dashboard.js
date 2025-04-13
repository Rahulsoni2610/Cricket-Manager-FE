export const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:3000/api/v1/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    return await response.json();
  } catch (error) {
    console.error('Dashboard API Error:', error);
    throw error;
  }
};