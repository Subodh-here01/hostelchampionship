import React from 'react';

const StatusBadge = ({ status }) => {
  let badgeStyles = 'bg-muted border-border text-text-muted';
  let icon = null;

  if (status === 'Live') {
    badgeStyles = 'bg-accent-red/10 border-accent-red/35 text-accent-red animate-pulse';
    icon = <span className="w-1.5 h-1.5 rounded-full bg-accent-red mr-1.5 inline-block"></span>;
  } else if (status === 'Completed') {
    badgeStyles = 'bg-accent/10 border-accent/30 text-accent';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold font-display uppercase tracking-wider border ${badgeStyles}`}>
      {icon}
      {status}
    </span>
  );
};

export default StatusBadge;
