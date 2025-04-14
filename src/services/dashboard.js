import { customFetch } from './customFetch';

export const fetchDashboardData = async () => {
  try {
    return await customFetch('/dashboard');
  } catch (error) {
    console.error('Dashboard API Error:', error);
    throw error;
  }
};
