import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Simple helper to decode JWT payload locally without external npm packages
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check tokens on boot
    const adminToken = localStorage.getItem('admin_token');

    if (adminToken) {
      const decoded = decodeJWT(adminToken);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: 'admin'
        });
      } else {
        localStorage.removeItem('admin_token');
      }
    }
    setLoading(false);
  }, []);

  // Admin login flow
  const loginAsAdmin = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/admin/login`, { email, password });
      const { token, user: adminUser } = res.data;
      
      localStorage.setItem('admin_token', token);
      setUser(adminUser);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed due to network errors.'
      };
    }
  };

  // Universal Logout
  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin: user?.role === 'admin',
      loginAsAdmin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
