import React from 'react';

const TeamBadge = ({ team, hideName = false }) => {
  if (!team) return <span className="text-text-muted italic">TBD</span>;

  return (
    <div className="flex items-center gap-2">
      <span 
        className="w-8 h-8 rounded bg-muted border flex items-center justify-center text-sm shadow-sm select-none"
        style={{ borderColor: `${team.color}35`, boxShadow: `0 0 10px ${team.color}15` }}
      >
        {team.emoji || '🏆'}
      </span>
      {!hideName && (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-bright leading-tight">{team.name}</span>
          <span className="text-[10px] text-text-muted leading-tight">{team.hostelBlock}</span>
        </div>
      )}
    </div>
  );
};

export default TeamBadge;
