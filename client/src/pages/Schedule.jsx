import React, { useState } from 'react';
import { useMatches } from '../hooks/useMatches';
import SportFilter from '../components/SportFilter';
import MatchCard from '../components/MatchCard';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_TABS = ['All', 'Live', 'Upcoming', 'Completed'];

const Schedule = () => {
  const [activeSport, setActiveSport] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');

  // Build filter query object
  const filters = {};
  if (activeSport !== 'All') {
    filters.sport = activeSport;
  }
  if (activeStatus !== 'All') {
    filters.status = activeStatus;
  }

  const { matches, loading, error } = useMatches(filters);

  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <span className="font-display font-bold uppercase tracking-widest text-accent text-sm block mb-1">
            TOURNAMENT TIMELINE
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-text-bright tracking-wide">
            MATCH <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">SCHEDULE</span>
          </h1>
          <p className="text-text-muted text-sm mt-2 max-w-xl">
            Browse upcoming fixture details, track running matches, and access streams or video archives.
          </p>
        </div>

        {/* Filters and Tabs */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Sports Filter Bar */}
          <div>
            <SportFilter activeFilter={activeSport} onFilterChange={setActiveSport} />
          </div>

          {/* Status Tabs Selector */}
          <div className="border-b border-border/40 flex gap-4 overflow-x-auto select-none relative">
            {STATUS_TABS.map((tab) => {
              const isActive = activeStatus === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveStatus(tab)}
                  className={`font-display uppercase font-bold text-sm tracking-wider pb-3 transition-all relative whitespace-nowrap focus:outline-none ${
                    isActive ? 'text-accent' : 'text-text-muted hover:text-text-bright'
                  }`}
                >
                  <span>{tab} Matches</span>
                  {isActive && (
                    <motion.span
                      layoutId="activeStatusIndicator"
                      className="absolute bottom-0 left-0 w-full h-[2px] bg-accent shadow-[0_0_10px_rgba(232,197,71,0.5)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule Grid */}
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
              <p className="font-display uppercase tracking-widest text-accent text-sm">Querying Fixtures Schedule...</p>
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
                <h4 className="font-bold font-display uppercase tracking-wider text-sm">Schedule Loading Error</h4>
                <p className="text-xs opacity-85 mt-1">{error}</p>
              </div>
            </motion.div>
          ) : matches.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-card border border-border/80 text-center py-20 rounded-md"
            >
              <i className="fa-solid fa-calendar-xmark text-text-muted text-4xl mb-4"></i>
              <p className="font-display uppercase tracking-wider text-text-muted text-sm font-semibold">
                No matches found for {activeSport !== 'All' ? activeSport : ''} {activeStatus !== 'All' ? activeStatus : ''} status
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeSport}-${activeStatus}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {matches.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Schedule;
