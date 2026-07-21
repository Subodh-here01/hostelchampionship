import api from './axios';

export const getGallery = (params = {}) => {
  return api.get('/api/gallery', { params });
};

export const createGalleryItem = (data) => {
  return api.post('/api/gallery', data);
};

export const deleteGalleryItem = (id) => {
  return api.delete(`/api/gallery/${id}`);
};
