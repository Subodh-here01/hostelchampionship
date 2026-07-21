import React from 'react';
import { motion } from 'framer-motion';

const SPORTS = ['All', 'Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI'];

const SPORT_EMOJIS = {
  All: '🏆',
  Cricket: '🏏',
  TT: '🏓',
  Badminton: '🏸',
  Chess: '♟️',
  Carrom: '🟤',
  BGMI: '🎮'
};

const SportFilter = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin select-none relative">
      {SPORTS.map((sport) => {
        const isActive = activeFilter === sport;
        const emoji = SPORT_EMOJIS[sport];

        return (
          <button
            key={sport}
            onClick={() => onFilterChange(sport)}
            className="relative flex items-center gap-2 px-4 py-2 rounded font-display font-bold text-sm uppercase tracking-wider whitespace-nowrap transition-colors duration-200 z-10"
            style={{
              color: isActive ? '#0A0A0E' : '#ECEFF4'
            }}
          >
            {isActive && (
              <motion.div
                layoutId="activeSportBg"
                className="absolute inset-0 bg-accent rounded -z-10 shadow-lg shadow-accent/25"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span>{emoji}</span>
            <span>{sport}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SportFilter;
