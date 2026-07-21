import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-height-[100vh] bg-base flex flex-col justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-display uppercase tracking-widest text-accent text-lg">Verifying Access Credentials...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
