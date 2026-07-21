import api from './axios';

export const getStandings = () => {
  return api.get('/api/standings');
};

export const getSportStandings = (sport) => {
  return api.get(`/api/standings/${sport}`);
};
