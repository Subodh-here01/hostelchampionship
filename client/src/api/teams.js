import api from './axios';

export const getTeams = () => {
  return api.get('/api/teams');
};

export const createTeam = (data) => {
  return api.post('/api/teams', data);
};

export const updateTeam = (id, data) => {
  return api.put(`/api/teams/${id}`, data);
};

export const deleteTeam = (id) => {
  return api.delete(`/api/teams/${id}`);
};
