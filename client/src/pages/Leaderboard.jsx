import React, { useState } from 'react';
import { useStandings } from '../hooks/useStandings';
import SportFilter from '../components/SportFilter';
import StandingsTable from '../components/StandingsTable';
import { motion, AnimatePresence } from 'framer-motion';

const Leaderboard = () => {
  const [activeSport, setActiveSport] = useState('All');
  const { standings, loading, error } = useStandings(activeSport);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Compute key stats dynamically from loaded standings
  const totalPointsAwarded = standings.reduce((sum, item) => sum + item.pts, 0);
  const leadingTeam = standings.find(item => item.rank === 1)?.team;
  const totalHostelMatchesPlayed = Math.round(standings.reduce((sum, item) => sum + item.mp, 0) / 2);

  const SPORTS_LIST = ['Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI'];
  const SPORT_EMOJIS = {
    Cricket: '🏏',
    TT: '🏓',
    Badminton: '🏸',
    Chess: '♟️',
    Carrom: '🟤',
    BGMI: '🎮'
  };

  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24 text-text-bright">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <span className="font-display font-bold uppercase tracking-widest text-accent text-sm block mb-1">
            TOURNAMENT CLASSIFICATION
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-text-bright tracking-wide">
            CHAMPIONSHIP <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">LEADERBOARD</span>
          </h1>
          <p className="text-text-muted text-sm mt-2 max-w-xl">
            Real-time standings computed dynamically. Points awarded based on final placements: 10 points for 1st, 6 points for 2nd, and 3 points for 3rd across all sports.
          </p>
        </div>

        {/* Overall Podium Placeholders */}
        {!loading && !error && activeSport === 'All' && standings.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center"
          >
            {/* Runner (2nd) */}
            <div className="bg-card/40 border border-border/60 p-6 rounded-md relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] shadow-lg">
              <span className="absolute top-3 left-3 text-text-muted text-xs font-black uppercase tracking-wider">2nd Place Overall</span>
              <div className="w-12 h-12 rounded-full bg-zinc-500/20 border border-zinc-500/35 flex items-center justify-center text-2xl mb-2">🥈</div>
              <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block">Championship Runner</span>
              <span className="font-display font-extrabold text-text-bright mt-1 text-base tracking-wider">
                {totalHostelMatchesPlayed > 0 ? (standings.find(item => item.rank === 2)?.team?.name || 'TBD') : 'TBD'}
              </span>
            </div>

            {/* Champion (1st) */}
            <div className="bg-accent/5 border border-accent/40 p-8 rounded-md relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] shadow-xl md:-translate-y-2">
              <span className="absolute top-3 left-3 text-accent text-xs font-black uppercase tracking-wider">1st Place Overall</span>
              <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center text-3xl mb-2 animate-pulse">🏆</div>
              <span className="text-accent text-[11px] uppercase font-bold tracking-wider block">Championship Winner</span>
              <span className="font-display font-extrabold text-accent mt-1 text-lg tracking-wider">
                {totalHostelMatchesPlayed > 0 ? (standings.find(item => item.rank === 1)?.team?.name || 'TBD') : 'TBD'}
              </span>
            </div>

            {/* 2nd Runner-up (3rd) */}
            <div className="bg-card/40 border border-border/60 p-6 rounded-md relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] shadow-lg">
              <span className="absolute top-3 left-3 text-text-muted text-xs font-black uppercase tracking-wider">3rd Place Overall</span>
              <div className="w-12 h-12 rounded-full bg-amber-600/20 border border-amber-600/35 flex items-center justify-center text-2xl mb-2">🥉</div>
              <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block">Championship 2nd Runner-up</span>
              <span className="font-display font-extrabold text-text-bright mt-1 text-base tracking-wider">
                {totalHostelMatchesPlayed > 0 ? (standings.find(item => item.rank === 3)?.team?.name || 'TBD') : 'TBD'}
              </span>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <SportFilter activeFilter={activeSport} onFilterChange={setActiveSport} />
        </div>

        {/* Sport Specific Podium Placeholders */}
        {activeSport !== 'All' && !loading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`grid grid-cols-1 ${!['Carrom', 'BGMI'].includes(activeSport) ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 mb-10 text-center`}
          >
            {/* Runner up (2nd) */}
            <div className="bg-card/40 border border-border/60 p-6 rounded-md relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] shadow-lg">
              <span className="absolute top-3 left-3 text-text-muted text-xs font-black uppercase tracking-wider">2nd Place</span>
              <div className="w-12 h-12 rounded-full bg-zinc-500/20 border border-zinc-500/35 flex items-center justify-center text-2xl mb-2">🥈</div>
              <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block">Runner</span>
              <span className="font-display font-extrabold text-text-bright mt-1 text-base tracking-wider">
                {standings.some(item => item.mp > 0) ? (standings.find(item => item.rank === 2)?.team?.name || 'TBD') : 'TBD'}
              </span>
            </div>

            {/* Winner (1st) */}
            <div className="bg-accent/5 border border-accent/40 p-8 rounded-md relative overflow-hidden flex flex-col items-center justify-center min-h-[160px] shadow-xl md:-translate-y-2">
              <span className="absolute top-3 left-3 text-accent text-xs font-black uppercase tracking-wider">1st Place</span>
              <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent/50 flex items-center justify-center text-3xl mb-2 animate-pulse">🏆</div>
              <span className="text-accent text-[11px] uppercase font-bold tracking-wider block">Winner</span>
              <span className="font-display font-extrabold text-accent mt-1 text-lg tracking-wider">
                {standings.some(item => item.mp > 0) ? (standings.find(item => item.rank === 1)?.team?.name || 'TBD') : 'TBD'}
              </span>
            </div>

            {/* 2nd Runner up (3rd) - Only for sports with 3rd place */}
            {!['Carrom', 'BGMI'].includes(activeSport) && (
              <div className="bg-card/40 border border-border/60 p-6 rounded-md relative overflow-hidden flex flex-col items-center justify-center min-h-[140px] shadow-lg">
                <span className="absolute top-3 left-3 text-text-muted text-xs font-black uppercase tracking-wider">3rd Place</span>
                <div className="w-12 h-12 rounded-full bg-amber-600/20 border border-amber-600/35 flex items-center justify-center text-2xl mb-2">🥉</div>
                <span className="text-text-muted text-[10px] uppercase font-bold tracking-wider block">2nd Runner-up</span>
                <span className="font-display font-extrabold text-text-bright mt-1 text-base tracking-wider">
                  {standings.some(item => item.mp > 0) ? (standings.find(item => item.rank === 3)?.team?.name || 'TBD') : 'TBD'}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Standings Grid / Table */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="py-24 flex flex-col justify-center items-center"
            >
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-display uppercase tracking-widest text-accent text-sm">Aggregating Tournament Leaderboard...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-accent-red/10 border border-accent-red/30 text-accent-red p-6 rounded-md flex items-center gap-4"
            >
              <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
              <div>
                <h4 className="font-bold font-display uppercase tracking-wider text-sm">Standings Calculation Error</h4>
                <p className="text-xs opacity-85 mt-1">{error}</p>
              </div>
            </motion.div>
          ) : standings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border/80 text-center py-20 rounded-md"
            >
              <i className="fa-solid fa-ban text-text-muted text-4xl mb-4"></i>
              <p className="font-display uppercase tracking-wider text-text-muted text-sm font-semibold">No finished matches record for {activeSport} yet</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeSport}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StandingsTable 
                standings={standings} 
                activeSport={activeSport} 
                onTeamClick={(team) => setSelectedTeam(team)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Points System Guide */}
        <div className="mt-8 bg-card/50 border border-border/60 rounded-md p-6">
          <h3 className="font-display font-bold uppercase tracking-wider text-text-bright text-base mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-info text-accent"></i>
            Championship Points Distribution Guide
          </h3>
          <div className="text-sm text-text-muted">
            <div className="bg-base/40 border border-border/30 p-4 rounded-sm max-w-md">
              <div className="font-display font-bold text-text-bright mb-2 flex items-center gap-1.5">
                🏆 All Arena Sports
              </div>
              <p className="text-[11px] text-text-muted mb-3 leading-relaxed">
                Points awarded to teams based on their final standings position in each individual sport:
              </p>
              <ul className="space-y-1.5 text-xs">
                <li className="flex justify-between border-b border-border/20 pb-1">
                  <span>Winner (1st Place)</span>
                  <span className="font-mono font-bold text-accent">10 pts</span>
                </li>
                <li className="flex justify-between border-b border-border/20 pb-1">
                  <span>Runner-up (2nd Place)</span>
                  <span className="font-mono font-bold text-accent-green">6 pts</span>
                </li>
                <li className="flex justify-between">
                  <span>Third Place (3rd Place)</span>
                  <span className="font-mono font-bold text-accent-red">3 pts</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-[11px] text-text-muted mt-4 italic">
            * Note: Individual match outcomes (Wins/Losses) within each sport are used to determine the placement ranking for that sport.
          </p>
        </div>

      </div>

      {/* Detailed Points Distribution Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTeam(null)}
              className="absolute inset-0 bg-black"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border w-full max-w-lg rounded-md shadow-2xl relative overflow-hidden z-10 p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{selectedTeam.team.emoji}</span>
                    <h2 className="font-display font-black text-xl text-text-bright leading-none uppercase tracking-wide">
                      {selectedTeam.team.name}
                    </h2>
                  </div>
                  <span className="text-xs text-text-muted font-semibold uppercase tracking-wider block">
                    Hostel: {selectedTeam.team.hostelBlock} • Group {selectedTeam.group}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedTeam(null)}
                  className="text-text-muted hover:text-text-bright transition-colors p-1"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              {/* Total points summary card */}
              <div className="bg-accent/5 border border-accent/25 rounded p-4 mb-6 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-accent uppercase font-black tracking-wider block">Championship Standing</span>
                  <span className="font-display font-extrabold text-sm text-text-bright">Rank {selectedTeam.rank} Overall</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">Total Points</span>
                  <span className="font-score text-3xl font-black text-accent">{selectedTeam.pts} <span className="text-xs font-display font-bold">PTS</span></span>
                </div>
              </div>

              {/* Sports Points Distribution List */}
              <div className="space-y-4">
                <h3 className="font-display font-bold uppercase tracking-wider text-xs text-text-bright">
                  Sports Points Breakdown
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {SPORTS_LIST.map((sport) => {
                    const points = selectedTeam.breakdown[sport] || 0;
                    const emoji = SPORT_EMOJIS[sport];
                    const placementLabel = selectedTeam.breakdownStatus[sport] === 'win' 
                      ? 'Winner' 
                      : (selectedTeam.breakdownStatus[sport] === 'draw' ? 'Podium' : 'No points');

                    return (
                      <div key={sport} className="bg-base/50 border border-border/40 p-3 rounded flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-text-bright block">
                            {emoji} {sport}
                          </span>
                          <span className="text-[10px] text-text-muted block mt-0.5">
                            {placementLabel}
                          </span>
                        </div>
                        <span className="font-score text-accent font-extrabold text-sm">
                          {points} pts
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Matches breakdown summary footer */}
              <div className="border-t border-border/40 mt-6 pt-4 flex justify-between items-center text-xs text-text-bright">
                <span>Total Matches: <strong className="text-text-bright font-score">{selectedTeam.mp}</strong></span>
                <span>Wins: <strong className="text-accent-green font-score">{selectedTeam.w}</strong></span>
                <span>Losses: <strong className="text-accent-red font-score">{selectedTeam.l}</strong></span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Leaderboard;
