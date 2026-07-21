import React, { useState } from 'react';

const CricketScorecard = ({ match }) => {
  const [activeTab, setActiveTab] = useState('A'); // 'A' or 'B' representing the batting team
  
  if (!match || match.sport !== 'Cricket') return null;

  const detail = match.detail || {};
  const inningsData = {
    A: {
      teamName: match.teamA?.name || 'Team A',
      batting: detail.battingA || [],
      bowling: detail.bowlingA || [],
      extras: detail.extrasA || { wd: 0, nb: 0, b: 0, lb: 0, total: 0 },
      fallOfWickets: detail.fowA || [],
      runs: detail.runsA || 0,
      wickets: detail.wicketsA || 0,
      overs: detail.oversA || 0,
      balls: detail.ballsA || 0,
      striker: detail.striker,
      nonStriker: detail.nonStriker,
      bowler: detail.bowler
    },
    B: {
      teamName: match.teamB?.name || 'Team B',
      batting: detail.battingB || [],
      bowling: detail.bowlingB || [],
      extras: detail.extrasB || { wd: 0, nb: 0, b: 0, lb: 0, total: 0 },
      fallOfWickets: detail.fowB || [],
      runs: detail.runsB || 0,
      wickets: detail.wicketsB || 0,
      overs: detail.oversB || 0,
      balls: detail.ballsB || 0,
      striker: detail.striker,
      nonStriker: detail.nonStriker,
      bowler: detail.bowler
    }
  };

  const activeInn = inningsData[activeTab];
  const totalBalls = (activeInn.overs * 6) + activeInn.balls;
  const runRate = totalBalls > 0 ? ((activeInn.runs / totalBalls) * 6).toFixed(2) : '0.00';

  return (
    <div className="bg-muted/40 border border-border/80 rounded-md overflow-hidden p-5 shadow-lg w-full text-xs text-[#E2E8F0]">
      
      {/* Innings Tabs */}
      <div className="flex gap-2 mb-4 border-b border-border/20 pb-3 select-none">
        <button
          onClick={() => setActiveTab('A')}
          className={`px-3 py-1.5 font-display font-bold uppercase rounded text-[10px] tracking-wider transition-colors ${
            activeTab === 'A' 
              ? 'bg-accent text-base font-black' 
              : 'bg-muted border border-border text-text-bright hover:border-accent/30'
          }`}
        >
          {inningsData.A.teamName} (1st Inn)
        </button>
        <button
          onClick={() => setActiveTab('B')}
          className={`px-3 py-1.5 font-display font-bold uppercase rounded text-[10px] tracking-wider transition-colors ${
            activeTab === 'B' 
              ? 'bg-accent text-base font-black' 
              : 'bg-muted border border-border text-text-bright hover:border-accent/30'
          }`}
        >
          {inningsData.B.teamName} (2nd Inn)
        </button>
      </div>

      {/* Batting Section */}
      <div className="mb-6">
        <div className="font-display uppercase text-text-bright font-bold tracking-wider mb-2 text-[10px] border-b border-border/20 pb-1">
          Batting scorecard
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#94A3B8] uppercase text-[9px] font-bold border-b border-border/10 pb-1 select-none">
                <th className="py-2 w-[40%]">Batter</th>
                <th className="py-2 w-[30%]">Dismissal</th>
                <th className="py-2 text-center w-[6%]">R</th>
                <th className="py-2 text-center w-[6%]">B</th>
                <th className="py-2 text-center w-[6%]">4s</th>
                <th className="py-2 text-center w-[6%]">6s</th>
                <th className="py-2 text-right w-[12%]">SR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {activeInn.batting.map((player, idx) => {
                const isStriker = detail.striker === player.name && match.status === 'Live' && detail.currentInnings === activeTab;
                const isNonStriker = detail.nonStriker === player.name && match.status === 'Live' && detail.currentInnings === activeTab;
                
                const sr = player.balls > 0 ? ((player.runs / player.balls) * 100).toFixed(1) : '0.0';

                return (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 font-semibold text-text-bright flex items-center gap-1">
                      {player.name}
                      {isStriker && <span className="text-accent text-[9px] animate-pulse">🏏*</span>}
                      {isNonStriker && <span className="text-[#94A3B8] text-[9px]">*</span>}
                    </td>
                    <td className="py-2 italic text-[11px] text-[#94A3B8]/90">{player.out ? player.howOut : 'not out'}</td>
                    <td className="py-2 text-center font-bold text-text-bright">{player.runs}</td>
                    <td className="py-2 text-center">{player.balls}</td>
                    <td className="py-2 text-center">{player.fours}</td>
                    <td className="py-2 text-center">{player.sixes}</td>
                    <td className="py-2 text-right font-mono">{sr}</td>
                  </tr>
                );
              })}
              {activeInn.batting.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-4 text-center text-[#94A3B8] italic">Innings not started yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Extras & Total Summary */}
      {activeInn.batting.length > 0 && (
        <div className="bg-[#0E0E12]/50 border border-border/20 rounded p-3 mb-6 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span>
              <strong>Extras:</strong> {activeInn.extras.total} (wd {activeInn.extras.wd}, nb {activeInn.extras.nb}, b {activeInn.extras.b}, lb {activeInn.extras.lb})
            </span>
          </div>
          <div className="flex justify-between items-center border-t border-border/10 pt-2 text-text-bright">
            <span className="text-sm font-bold">
              Total Score: {activeInn.runs} / {activeInn.wickets} <span className="text-[11px] font-normal text-[#94A3B8]">({activeInn.overs}.{activeInn.balls} Ov)</span>
            </span>
            <span className="font-mono text-xs font-semibold">
              Run Rate: {runRate}
            </span>
          </div>
        </div>
      )}

      {/* Bowling Section */}
      <div className="mb-6">
        <div className="font-display uppercase text-text-bright font-bold tracking-wider mb-2 text-[10px] border-b border-border/20 pb-1">
          Bowling scorecard
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#94A3B8] uppercase text-[9px] font-bold border-b border-border/10 pb-1 select-none">
                <th className="py-2 w-[40%]">Bowler</th>
                <th className="py-2 text-center w-[10%]">O</th>
                <th className="py-2 text-center w-[10%]">M</th>
                <th className="py-2 text-center w-[10%]">R</th>
                <th className="py-2 text-center w-[10%]">W</th>
                <th className="py-2 text-center w-[10%]">NB</th>
                <th className="py-2 text-center w-[10%]">WD</th>
                <th className="py-2 text-right w-[10%]">ECO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {activeInn.bowling.map((bowler, idx) => {
                const isCurrent = detail.bowler === bowler.name && match.status === 'Live' && detail.currentInnings === activeTab;
                const totalBowlerBalls = (bowler.overs * 6) + bowler.balls;
                const econ = totalBowlerBalls > 0 ? ((bowler.runs / totalBowlerBalls) * 6).toFixed(2) : '0.00';
                
                return (
                  <tr key={idx} className="hover:bg-muted/10 transition-colors">
                    <td className="py-2 font-semibold text-text-bright flex items-center gap-1">
                      {bowler.name}
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-accent-green inline-block animate-pulse"></span>}
                    </td>
                    <td className="py-2 text-center">{bowler.overs}.{bowler.balls}</td>
                    <td className="py-2 text-center">{bowler.maidens || 0}</td>
                    <td className="py-2 text-center font-bold text-text-bright">{bowler.runs}</td>
                    <td className="py-2 text-center font-bold text-accent-green">{bowler.wickets}</td>
                    <td className="py-2 text-center">{bowler.nb}</td>
                    <td className="py-2 text-center">{bowler.wd}</td>
                    <td className="py-2 text-right font-mono">{econ}</td>
                  </tr>
                );
              })}
              {activeInn.bowling.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-[#94A3B8] italic">No bowler logs yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      {activeInn.fallOfWickets.length > 0 && (
        <div>
          <div className="font-display uppercase text-text-bright font-bold tracking-wider mb-2 text-[10px] border-b border-border/20 pb-1">
            Fall of wickets
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px]">
            {activeInn.fallOfWickets.map((fow, idx) => (
              <span key={idx} className="bg-card px-2 py-1 rounded-sm border border-border/40">
                <strong>{fow.wickets}-{fow.score}</strong> ({fow.name}, {fow.over} ov)
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default CricketScorecard;
