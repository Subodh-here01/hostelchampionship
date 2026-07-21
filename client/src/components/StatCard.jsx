import React from 'react';

const StatCard = ({ title, value, icon, color = 'text-accent' }) => {
  return (
    <div className="bg-card border border-border/80 rounded-md p-6 flex justify-between items-center shadow-lg glow-gold-left">
      <div className="flex flex-col gap-1">
        <span className="text-text-muted text-xs uppercase tracking-wider font-semibold">
          {title}
        </span>
        <span className="font-score text-3xl font-black text-text-bright tracking-tight">
          {value}
        </span>
      </div>
      <div className={`w-12 h-12 rounded bg-muted/40 border border-border/40 flex items-center justify-center text-xl ${color}`}>
        <i className={icon}></i>
      </div>
    </div>
  );
};

export default StatCard;
