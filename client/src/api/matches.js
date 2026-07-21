import api from './axios';

export const getMatches = (params = {}) => {
  return api.get('/api/matches', { params });
};

export const createMatch = (data) => {
  return api.post('/api/matches', data);
};

export const updateMatch = (id, data) => {
  return api.put(`/api/matches/${id}`, data);
};

export const deleteMatch = (id) => {
  return api.delete(`/api/matches/${id}`);
};

export const getMatchById = (id) => {
  return api.get(`/api/matches/${id}`);
};

export const updateMatchScore = (id, data) => {
  return api.put(`/api/matches/${id}/score`, data);
};

export const undoMatchScore = (id) => {
  return api.post(`/api/matches/${id}/undo`);
};
