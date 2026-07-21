import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
    triggerToast('Logged out successfully.');
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-[70px] bg-base/80 backdrop-blur-md border-b border-border z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-display text-xl md:text-2xl font-black tracking-wider text-text-bright">
            🏟️ <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">MSRIT HOSTEL CHAMPIONSHIP 2026</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => `font-display uppercase font-bold text-sm tracking-wider transition-colors duration-200 hover:text-accent ${isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-bright'}`}>
              Home
            </NavLink>
            <NavLink to="/leaderboard" className={({ isActive }) => `font-display uppercase font-bold text-sm tracking-wider transition-colors duration-200 hover:text-accent ${isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-bright'}`}>
              Leaderboard
            </NavLink>
            <NavLink to="/schedule" className={({ isActive }) => `font-display uppercase font-bold text-sm tracking-wider transition-colors duration-200 hover:text-accent ${isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-bright'}`}>
              Schedule
            </NavLink>
            <NavLink to="/gallery" className={({ isActive }) => `font-display uppercase font-bold text-sm tracking-wider transition-colors duration-200 hover:text-accent ${isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-bright'}`}>
              Photos
            </NavLink>
            <NavLink to="/rules" className={({ isActive }) => `font-display uppercase font-bold text-sm tracking-wider transition-colors duration-200 hover:text-accent ${isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-text-bright'}`}>
              Rules
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={({ isActive }) => `font-display uppercase font-bold text-sm tracking-wider transition-colors duration-200 hover:text-accent text-accent border border-accent/30 px-3 py-1 rounded-sm ${isActive ? 'bg-accent/10 border-accent' : ''}`}>
                Admin Panel
              </NavLink>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-muted border border-border px-3 py-1.5 rounded hover:bg-muted/80 transition-all focus:outline-none"
                >
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent text-base flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-semibold max-w-[120px] truncate">{user.name}</span>
                  <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-185' : ''}`}></i>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded shadow-xl py-1 z-50">
                    <div className="px-4 py-2 border-b border-border/55">
                      <p className="text-xs text-text-muted">Logged in as</p>
                      <p className="text-sm font-bold truncate text-accent">{user.role.toUpperCase()}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin/dashboard" className="block w-full text-left px-4 py-2 text-sm text-text-bright hover:bg-muted transition-colors" onClick={() => setDropdownOpen(false)}>
                        <i className="fa-solid fa-gauge mr-2"></i> Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-accent-red hover:bg-muted transition-colors"
                    >
                      <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-text-bright hover:text-accent transition-colors p-1"
              aria-label="Toggle Menu"
            >
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Slide-out */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-[70px] left-0 w-full bg-base/95 backdrop-blur-lg border-b border-border flex flex-col py-6 px-4 gap-4 z-40 transition-all duration-300">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display uppercase font-bold text-lg tracking-wider transition-colors ${isActive ? 'text-accent' : 'text-text-bright'}`}>
              Home
            </NavLink>
            <NavLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display uppercase font-bold text-lg tracking-wider transition-colors ${isActive ? 'text-accent' : 'text-text-bright'}`}>
              Leaderboard
            </NavLink>
            <NavLink to="/schedule" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display uppercase font-bold text-lg tracking-wider transition-colors ${isActive ? 'text-accent' : 'text-text-bright'}`}>
              Schedule
            </NavLink>
            <NavLink to="/gallery" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display uppercase font-bold text-lg tracking-wider transition-colors ${isActive ? 'text-accent' : 'text-text-bright'}`}>
              Photos
            </NavLink>
            <NavLink to="/rules" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `font-display uppercase font-bold text-lg tracking-wider transition-colors ${isActive ? 'text-accent' : 'text-text-bright'}`}>
              Rules
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="font-display uppercase font-bold text-lg tracking-wider text-accent border border-accent/20 p-2 text-center rounded">
                Admin Panel
              </NavLink>
            )}
            
            {user && (
              <div className="border-t border-border mt-4 pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 px-1">
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent text-base flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.email} &middot; <span className="text-accent">{user.role}</span></p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-accent-red/10 border border-accent-red/35 hover:bg-accent-red hover:text-text-bright text-accent-red py-2 px-4 rounded text-center font-bold transition-all"
                >
                  <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-card border-l-4 border-accent text-text-bright px-5 py-3.5 rounded shadow-2xl z-[9999] animate-bounce flex items-center gap-3">
          <i className="fa-solid fa-circle-info text-accent text-lg"></i>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </>
  );
};

export default Navbar;
