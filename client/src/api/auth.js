import api from './axios';

export const loginAdmin = (email, password) => {
  return api.post('/api/auth/admin/login', { email, password });
};


export const createAdminAccount = (data, secret) => {
  return api.post('/api/auth/create-admin', data, {
    headers: {
      'x-admin-secret': secret
    }
  });
};
