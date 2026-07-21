import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#07070A] border-t border-border/80 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 font-display text-xl md:text-2xl font-black tracking-wider text-text-bright">
              🏟️ <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">MSRIT HOSTEL CHAMPIONSHIP 2026</span>
            </Link>
            <p className="text-text-muted text-sm max-w-sm">
              The annual flagship intra-hostel sports tournament. 10 teams compete in 6 sports. Designed to unleash competitive spirits and athletic supremacy.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-text-bright hover:bg-accent hover:text-base hover:border-accent transition-all duration-300">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-text-bright hover:bg-accent hover:text-base hover:border-accent transition-all duration-300">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-text-bright hover:bg-accent hover:text-base hover:border-accent transition-all duration-300">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-muted border border-border flex items-center justify-center text-text-bright hover:bg-accent hover:text-base hover:border-accent transition-all duration-300">
                <i className="fa-brands fa-discord"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display uppercase text-text-bright font-bold tracking-wider text-base mb-6 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-6 after:height-[2px] after:bg-accent">
              Quick Navigation
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-text-muted">
              <li><Link to="/" className="hover:text-accent hover:pl-1 transition-all duration-200">Home Base</Link></li>
              <li><Link to="/leaderboard" className="hover:text-accent hover:pl-1 transition-all duration-200">Leaderboard Standings</Link></li>
              <li><Link to="/schedule" className="hover:text-accent hover:pl-1 transition-all duration-200">Match Timeline</Link></li>
              <li><Link to="/gallery" className="hover:text-accent hover:pl-1 transition-all duration-200">Match Moments Gallery</Link></li>
              <li><Link to="/rules" className="hover:text-accent hover:pl-1 transition-all duration-200">Official Rules & Timelines</Link></li>
            </ul>
          </div>

          {/* Support/Info */}
          <div>
            <h4 className="font-display uppercase text-text-bright font-bold tracking-wider text-base mb-6 relative after:content-[''] after:absolute after:bottom-[-6px] after:left-0 after:w-6 after:height-[2px] after:bg-accent">
              Council Office
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-text-muted">
              <li><i className="fa-solid fa-envelope text-accent mr-2"></i> hostelchampionship@gmail.com</li>
              <li>
                <a href="https://maps.app.goo.gl/WiLe36VFuUZhKQVX6" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  <i className="fa-solid fa-location-dot text-accent mr-2"></i> MSRIT College Ground
                </a>
              </li>
              <li><i className="fa-solid fa-clipboard-list text-accent mr-2"></i> MSRIT Hostel Sports Council 2026</li>
              <li><Link to="/rules" className="hover:text-accent transition-colors"><i className="fa-solid fa-file-pdf text-accent mr-2"></i> Official Rulebook</Link></li>
            </ul>
          </div>

        </div>

        {/* Lower row */}
        <div className="border-t border-border/40 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>&copy; 2026 MSRIT Hostel Sports Championship Council. All Rights Reserved.</p>
          
          {/* Organized By TEAM ELITE - gold, centered, small caps */}
          <div className="text-center font-display uppercase tracking-widest text-accent text-sm font-extrabold select-none">
            ORGANIZED BY <span className="text-[#800000] font-black">TEAM ELITE</span>
          </div>

          <p>
            Made with <i className="fa-solid fa-heart text-accent-red animate-pulse"></i> for MSRIT Hostel Championship 2026
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
