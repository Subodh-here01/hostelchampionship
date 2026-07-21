import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <div className="mb-10 bg-card border border-border/80 p-4 rounded flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
      
      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-4 select-none">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => `px-4 py-2 font-display uppercase font-bold text-xs tracking-wider border rounded transition-colors ${
            isActive ? 'bg-accent border-accent text-base' : 'bg-muted border-border/60 text-text-bright hover:border-accent/40'
          }`}
        >
          <i className="fa-solid fa-gauge mr-1.5"></i> Overview
        </NavLink>
        <NavLink 
          to="/admin/matches" 
          className={({ isActive }) => `px-4 py-2 font-display uppercase font-bold text-xs tracking-wider border rounded transition-colors ${
            isActive ? 'bg-accent border-accent text-base' : 'bg-muted border-border/60 text-text-bright hover:border-accent/40'
          }`}
        >
          <i className="fa-solid fa-calendar-check mr-1.5"></i> Manage Matches
        </NavLink>
        <NavLink 
          to="/admin/teams" 
          className={({ isActive }) => `px-4 py-2 font-display uppercase font-bold text-xs tracking-wider border rounded transition-colors ${
            isActive ? 'bg-accent border-accent text-base' : 'bg-muted border-border/60 text-text-bright hover:border-accent/40'
          }`}
        >
          <i className="fa-solid fa-shield mr-1.5"></i> Manage Teams
        </NavLink>
        <NavLink 
          to="/admin/gallery" 
          className={({ isActive }) => `px-4 py-2 font-display uppercase font-bold text-xs tracking-wider border rounded transition-colors ${
            isActive ? 'bg-accent border-accent text-base' : 'bg-muted border-border/60 text-text-bright hover:border-accent/40'
          }`}
        >
          <i className="fa-solid fa-images mr-1.5"></i> Manage Gallery
        </NavLink>
      </div>

      {/* Back to public link */}
      <div>
        <Link 
          to="/" 
          className="text-text-muted hover:text-accent font-display uppercase font-bold text-xs tracking-wider transition-colors inline-flex items-center gap-1.5"
        >
          <i className="fa-solid fa-arrow-left"></i> Public Platform
        </Link>
      </div>

    </div>
  );
};

export default AdminHeader;
