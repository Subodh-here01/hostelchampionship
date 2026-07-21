import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminHeader from '../components/AdminHeader';
import StatCard from '../components/StatCard';
import TeamBadge from '../components/TeamBadge';
import { getMatches } from '../api/matches';
import { getTeams } from '../api/teams';
import { getGallery } from '../api/gallery';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    teamsCount: 0,
    matchesCount: 0,
    liveCount: 0,
    upcomingCount: 0,
    completedCount: 0,
    galleryCount: 0
  });
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [teamsRes, matchesRes, galleryRes] = await Promise.all([
          getTeams(),
          getMatches(),
          getGallery()
        ]);

        const teams = teamsRes.data || [];
        const matches = matchesRes.data || [];
        const gallery = galleryRes.data || [];

        const live = matches.filter(m => m.status === 'Live').length;
        const upcoming = matches.filter(m => m.status === 'Upcoming').length;
        const completed = matches.filter(m => m.status === 'Completed').length;

        setStats({
          teamsCount: teams.length,
          matchesCount: matches.length,
          liveCount: live,
          upcomingCount: upcoming,
          completedCount: completed,
          galleryCount: gallery.length
        });

        // Get the latest 5 matches
        setRecentMatches(matches.slice(0, 5));
      } catch (err) {
        console.error('Error loading admin overview stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro greeting */}
        <div className="mb-6">
          <span className="font-display font-bold uppercase tracking-widest text-accent text-sm">
            CONTROL CENTER
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-text-bright tracking-wide mt-1">
            System <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">Administrator Overview</span>
          </h1>
          <p className="text-text-muted text-xs mt-1.5 leading-relaxed">
            Welcome back, <strong className="text-text-bright">{user?.name || 'Admin'}</strong>. Use the control dials to update teams, fixtures, and gallery assets.
          </p>
        </div>

        {/* Tab Header Navigation */}
        <AdminHeader />

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-display uppercase tracking-widest text-accent text-sm">Synchronizing Database Metrics...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            
            {/* Widget Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Registered Teams" value={stats.teamsCount} icon="fa-solid fa-shield-halved" color="text-accent" />
              <StatCard title="Scheduled Games" value={stats.matchesCount} icon="fa-solid fa-gamepad" color="text-sky-400" />
              <StatCard title="Live Games" value={stats.liveCount} icon="fa-solid fa-rss animate-pulse" color="text-accent-red" />
              <StatCard title="Gallery Assets" value={stats.galleryCount} icon="fa-solid fa-images" color="text-accent-green" />
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent games list */}
              <div className="bg-card border border-border/80 rounded-md p-6 lg:col-span-2 shadow-lg flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-border/40 pb-3">
                  <h3 className="font-display uppercase font-bold text-lg text-text-bright">
                    Recent Fixtures Timeline
                  </h3>
                  <span className="text-xs text-text-muted">Showing latest 5 entries</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/30 text-text-muted text-[10px] uppercase font-bold tracking-wider">
                        <th className="py-2">Sport</th>
                        <th className="py-2">Clash Details</th>
                        <th className="py-2 text-center">Score</th>
                        <th className="py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20 text-xs">
                      {recentMatches.map((m) => (
                        <tr key={m._id} className="hover:bg-muted/30">
                          <td className="py-3 font-semibold text-accent">{m.sport}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold">{m.teamA?.name}</span>
                              <span className="text-text-muted">vs</span>
                              <span className="font-bold">{m.teamB?.name}</span>
                            </div>
                          </td>
                          <td className="py-3 font-score text-center text-text-bright bg-black/10">
                            {m.scoreA} – {m.scoreB}
                          </td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-[3px] text-[10px] font-bold font-display uppercase tracking-wider ${
                              m.status === 'Live' ? 'bg-accent-red/10 text-accent-red animate-pulse' :
                              m.status === 'Completed' ? 'bg-accent-green/10 text-accent-green' :
                              'bg-muted text-text-muted'
                            }`}>
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Breakdown Panel */}
              <div className="bg-card border border-border/80 rounded-md p-6 shadow-lg flex flex-col gap-4">
                <h3 className="font-display uppercase font-bold text-lg text-text-bright border-b border-border/40 pb-3">
                  Match Status Ratio
                </h3>
                <div className="flex flex-col gap-4 mt-2 justify-center h-full">
                  <div className="flex justify-between items-center border-b border-border/10 pb-2">
                    <span className="text-xs text-text-muted flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-accent-red rounded-full"></span> Live Arena Streams
                    </span>
                    <span className="font-score text-base font-bold text-accent-red">{stats.liveCount}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/10 pb-2">
                    <span className="text-xs text-text-muted flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-sky-400 rounded-full"></span> Upcoming Schedules
                    </span>
                    <span className="font-score text-base font-bold text-sky-400">{stats.upcomingCount}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/10 pb-2">
                    <span className="text-xs text-text-muted flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-accent-green rounded-full"></span> Completed Clashes
                    </span>
                    <span className="font-score text-base font-bold text-accent-green">{stats.completedCount}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-sm font-bold">
                    <span>Total Aggregate Matches</span>
                    <span className="font-score text-lg text-accent">{stats.matchesCount}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
