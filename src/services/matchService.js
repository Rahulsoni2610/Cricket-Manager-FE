import { customFetch } from './customFetch';

export const fetchMatches = async () => {
  return customFetch('/matches');
};

export const createMatch = async (match) => {
  return customFetch('/matches', {
    method: 'POST',
    body: JSON.stringify({ match }),
  });
};
