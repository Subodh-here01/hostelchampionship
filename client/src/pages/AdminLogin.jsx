import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const { user, loginAsAdmin, isAdmin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in as admin, redirect out
  useEffect(() => {
    if (user && isAdmin) {
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    }
  }, [user, isAdmin, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (!email || !password) {
      setErrorMsg('Please supply all required login credentials.');
      setLoading(false);
      return;
    }

    const result = await loginAsAdmin(email, password);
    setLoading(false);

    if (result.success) {
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-base flex flex-col justify-center items-center py-20 px-4">
      <div className="max-w-md w-full bg-card border border-border/80 rounded-md p-8 shadow-2xl relative glow-gold-left">
        
        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-display font-bold uppercase tracking-widest text-accent text-xs">
            SECURITY PROTOCOL
          </span>
          <h2 className="font-display text-3xl font-black uppercase text-text-bright tracking-wide mt-2">
            ADMINISTRATOR <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">ACCESS</span>
          </h2>
          <p className="text-text-muted text-xs mt-1.5 leading-relaxed">
            Please log in with system administrator credentials to modify tournament databases.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs py-3 px-4 rounded mb-6 flex items-start gap-2.5">
            <i className="fa-solid fa-triangle-exclamation mt-0.5"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted text-xs uppercase tracking-wider font-semibold">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. hostelchampionship@gmail.com"
                className="w-full bg-muted border border-border/80 text-text-bright rounded px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-accent transition-colors"
                required
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                <i className="fa-solid fa-envelope"></i>
              </span>
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-text-muted text-xs uppercase tracking-wider font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-muted border border-border/80 text-text-bright rounded px-4 py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:border-accent transition-colors"
                required
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                <i className="fa-solid fa-key"></i>
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-bright transition-colors text-sm focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 text-base font-display uppercase font-bold py-3 rounded text-sm tracking-wider shadow-lg shadow-accent/15 transition-all duration-200 mt-2 flex justify-center items-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-base border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <i className="fa-solid fa-lock-open"></i> Unlock Dashboard
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
