import React from 'react';
import TeamBadge from './TeamBadge';

const SPORTS_LIST = ['Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI'];
const SPORT_EMOJIS = {
  Cricket: '🏏',
  TT: '🏓',
  Badminton: '🏸',
  Chess: '♟️',
  Carrom: '🟤',
  BGMI: '🎮'
};

const StandingsTable = ({ standings, activeSport = 'All', onTeamClick }) => {
  
  // Render a single table for a given standings dataset
  const renderTable = (tableData, isGroupTable = false) => {
    return (
      <div className="bg-card border border-border/80 rounded-md overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0E0E12] border-b border-border/50 text-text-muted text-xs uppercase tracking-wider font-display font-bold select-none">
                <th className="py-4 px-5 w-[10%] text-center">Rank</th>
                <th className="py-4 px-5 w-[35%]">Hostel Team</th>
                <th className="py-4 px-4 text-center w-[12%]">M</th>
                <th className="py-4 px-4 text-center w-[12%]">W</th>
                <th className="py-4 px-4 text-center w-[12%]">L</th>
                {activeSport === 'Cricket' && <th className="py-4 px-4 text-center w-[12%]">NRR</th>}
                <th className="py-4 px-5 text-center w-[15%] text-accent font-bold">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {tableData.map((row) => {
                const { team, mp, w, l, pts, rank, groupRank } = row;
                const displayRank = isGroupTable ? groupRank : rank;
                
                // Top 3 medals/badge styling
                let rankBadge = displayRank;
                let bgHighlight = '';

                if (displayRank === 1) {
                  rankBadge = '🥇';
                  bgHighlight = 'bg-accent/5';
                } else if (displayRank === 2) {
                  rankBadge = '🥈';
                  bgHighlight = 'bg-text-muted/5';
                } else if (displayRank === 3) {
                  rankBadge = '🥉';
                  bgHighlight = 'bg-amber-800/5';
                }

                return (
                  <tr 
                    key={team.id} 
                    onClick={() => !isGroupTable && onTeamClick && onTeamClick(row)}
                    className={`hover:bg-muted/40 transition-colors duration-150 ${bgHighlight} ${!isGroupTable && onTeamClick ? 'cursor-pointer' : ''}`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-5 font-score font-bold text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${
                        displayRank === 1 ? 'shadow-[0_0_12px_rgba(232,197,71,0.3)] bg-accent text-base' :
                        displayRank === 2 ? 'bg-zinc-400 text-base' :
                        displayRank === 3 ? 'bg-amber-600 text-text-bright' : 'text-text-muted'
                      }`}>
                        {rankBadge}
                      </span>
                    </td>

                    {/* Team Badge */}
                    <td className="py-4 px-5">
                      <TeamBadge team={team} />
                      {!isGroupTable && onTeamClick && (
                        <span className="text-[10px] text-accent block mt-0.5 font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to view breakdown
                        </span>
                      )}
                    </td>

                    {/* Stats */}
                    <td className="py-4 px-4 font-score text-center text-sm text-text-bright">{mp}</td>
                    <td className="py-4 px-4 font-score text-center text-sm text-accent-green font-bold">{w}</td>
                    <td className="py-4 px-4 font-score text-center text-sm text-accent-red">{l}</td>
                    
                    {/* NRR */}
                    {activeSport === 'Cricket' && (
                      <td className="py-4 px-4 font-score text-center text-sm text-text-bright font-bold">
                        {team.nrr !== undefined ? (team.nrr >= 0 ? `+${team.nrr.toFixed(3)}` : team.nrr.toFixed(3)) : '0.000'}
                      </td>
                    )}
                    
                    {/* Points */}
                    <td className="py-4 px-5 font-score text-center text-base text-accent font-extrabold shadow-inner">{pts}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (activeSport === 'All') {
    return renderTable(standings, false);
  }

  // Split into Group A and Group B
  const groupATeams = standings.filter(item => item.group === 'A');
  const groupBTeams = standings.filter(item => item.group === 'B');

  return (
    <div className="space-y-12">
      {/* Group A Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-extrabold uppercase text-lg text-accent tracking-wider">
            Group A Standings
          </h2>
        </div>
        {renderTable(groupATeams, true)}
      </div>

      {/* Group B Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-extrabold uppercase text-lg text-accent-red tracking-wider">
            Group B Standings
          </h2>
        </div>
        {renderTable(groupBTeams, true)}
      </div>
    </div>
  );
};

export default StandingsTable;
