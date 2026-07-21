import api from './axios';

export const getVenues = () => {
  return api.get('/api/venues');
};

export const createVenue = (data) => {
  return api.post('/api/venues', data);
};

export const updateVenue = (id, data) => {
  return api.put(`/api/venues/${id}`, data);
};

export const deleteVenue = (id) => {
  return api.delete(`/api/venues/${id}`);
};
