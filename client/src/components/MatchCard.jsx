import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import TeamBadge from './TeamBadge';
import CricketScorecard from './CricketScorecard';

const SPORT_EMOJIS = {
  Cricket: '🏏',
  TT: '🏓',
  Badminton: '🏸',
  Chess: '♟️',
  Carrom: '🟤',
  BGMI: '🎮'
};

const MatchCard = ({ match }) => {
  const { sport, category, teamA, teamB, scoreA, scoreB, date, venue, status, youtubeUrl, winner, detail } = match;
  const [showScorecard, setShowScorecard] = useState(false);

  const emoji = SPORT_EMOJIS[sport] || '🏆';

  // Helper to safely get string ID from populated or unpopulated Mongoose references
  const getId = (obj) => {
    if (!obj) return '';
    return typeof obj === 'object' ? obj._id : obj;
  };

  // Highlight winner on completion
  const isCompleted = status === 'Completed';
  const winnerId = getId(winner);
  const teamAId = getId(teamA);
  const teamBId = getId(teamB);

  const teamAWins = isCompleted && winnerId && winnerId === teamAId;
  const teamBWins = isCompleted && winnerId && winnerId === teamBId;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const renderScore = (score, teamLetter) => {
    if (sport === 'Cricket') {
      const w = detail?.[`wickets${teamLetter}`] !== undefined ? detail[`wickets${teamLetter}`] : 0;
      const ov = detail?.[`overs${teamLetter}`] !== undefined ? detail[`overs${teamLetter}`] : 0;
      const b = detail?.[`balls${teamLetter}`] !== undefined ? detail[`balls${teamLetter}`] : 0;
      return `${score}/${w} (${ov}.${b} Ov)`;
    }
    return score;
  };

  const hasScorecardData = sport === 'Cricket' && detail && (detail.battingA || detail.battingB);

  return (
    <div className="bg-card border border-border/80 rounded-md p-5 flex flex-col gap-4 shadow-lg hover:border-accent/40 transition-all duration-300 glow-gold-left">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border/50 pb-3">
        <span className="font-display font-bold text-sm uppercase tracking-wider text-accent flex items-center gap-1.5">
          <span>{emoji}</span> {sport} {category && category !== 'N/A' && `(${category})`}
        </span>
        <StatusBadge status={status} />
      </div>

      {/* Teams and Scores */}
      <div className="flex flex-col gap-3 my-1">
        {/* Team A */}
        <div className={`flex justify-between items-center p-1 rounded ${teamAWins ? 'bg-accent/5' : ''}`}>
          <TeamBadge team={teamA} />
          <span className={`font-score font-bold text-base ${teamAWins ? 'text-[#FFD700]' : 'text-text-bright'}`}>
            {renderScore(scoreA, 'A')}
          </span>
        </div>
        
        {/* Team B */}
        <div className={`flex justify-between items-center p-1 rounded ${teamBWins ? 'bg-accent/5' : ''}`}>
          <TeamBadge team={teamB} />
          <span className={`font-score font-bold text-base ${teamBWins ? 'text-[#FFD700]' : 'text-text-bright'}`}>
            {renderScore(scoreB, 'B')}
          </span>
        </div>
      </div>

      {/* Footer details */}
      <div className="border-t border-border/50 pt-3 flex justify-between items-center text-xs text-text-muted">
        <span>
          <i className="fa-solid fa-location-dot text-accent mr-1"></i> {venue}
        </span>
        <span>
          <i className="fa-solid fa-calendar-days text-accent mr-1"></i> {formattedDate}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-1">
        {status === 'Live' ? (
          <a
            href={youtubeUrl || 'https://youtube.com/live'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-2 bg-accent-red hover:bg-accent-red/90 text-text-bright py-2 rounded text-xs font-bold font-display uppercase tracking-wider shadow-md shadow-accent-red/20 transition-all duration-300 animate-pulse"
          >
            <i className="fa-solid fa-play"></i> Watch Live Stream
          </a>
        ) : isCompleted ? (
          <a
            href={youtubeUrl || 'https://youtube.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-2 bg-transparent border border-accent text-accent hover:bg-accent/10 py-2 rounded text-xs font-bold font-display uppercase tracking-wider transition-all duration-300"
          >
            <i className="fa-solid fa-arrow-rotate-right"></i> Watch Match Replay
          </a>
        ) : (
          <button
            disabled
            className="w-full inline-flex justify-center items-center gap-2 bg-muted/50 border border-border/50 text-text-muted/65 py-2 rounded text-xs font-bold font-display uppercase tracking-wider cursor-not-allowed"
          >
            <i className="fa-solid fa-lock"></i> Locked &middot; Not Started
          </button>
        )}

        {/* Collapsable Scorecard Toggle */}
        {hasScorecardData && (
          <button
            onClick={() => setShowScorecard(!showScorecard)}
            className="w-full inline-flex justify-center items-center gap-1.5 bg-[#121218] border border-border hover:border-accent/40 text-text-bright py-2 rounded text-xs font-semibold font-display uppercase tracking-wider transition-all"
          >
            <i className={`fa-solid ${showScorecard ? 'fa-chevron-up' : 'fa-chart-bar'}`}></i>
            {showScorecard ? 'Hide Scorecard' : 'Show Scorecard'}
          </button>
        )}
      </div>

      {/* Render scorecard if open */}
      {showScorecard && hasScorecardData && (
        <div className="mt-2 animate-fadeIn">
          <CricketScorecard match={match} />
        </div>
      )}

    </div>
  );
};

export default MatchCard;
