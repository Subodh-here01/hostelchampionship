import React, { useState, useEffect } from 'react';
import { getMatches } from '../api/matches';

const SPORT_EMOJIS = {
  Cricket: '🏏',
  TT: '🏓',
  Badminton: '🏸',
  Chess: '♟️',
  Carrom: '🟤',
  BGMI: '🎮'
};

const LiveBanner = () => {
  const [liveMatch, setLiveMatch] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await getMatches({ status: 'Live' });
        if (res.data && res.data.length > 0) {
          setLiveMatch(res.data[0]); // Show the first active live match
        } else {
          setLiveMatch(null);
        }
      } catch (err) {
        console.error('Error fetching live matches for banner:', err);
      }
    };

    fetchLive();
    
    // Poll for live score updates every 3 seconds
    const interval = setInterval(fetchLive, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!liveMatch || !visible) return null;

  const emoji = SPORT_EMOJIS[liveMatch.sport] || '🏆';

  const getLiveStatusDetail = () => {
    if (!liveMatch.detail) return '';
    const d = liveMatch.detail;
    if (liveMatch.sport === 'Cricket') {
      const oversA = d.oversA !== undefined ? `${d.oversA}.${d.ballsA || 0} Ov` : '';
      const oversB = d.oversB !== undefined ? `${d.oversB}.${d.ballsB || 0} Ov` : '';
      let details = [];
      if (oversA) details.push(`${liveMatch.teamA?.name}: ${d.runsA || 0}/${d.wicketsA || 0} (${oversA})`);
      if (oversB) details.push(`${liveMatch.teamB?.name}: ${d.runsB || 0}/${d.wicketsB || 0} (${oversB})`);
      return details.join(' | ');
    }
    if (liveMatch.sport === 'TT' || liveMatch.sport === 'Badminton') {
      if (d.sets && d.sets.length > 0) {
        return `Sets: ${d.sets.map(s => `${s.scoreA}-${s.scoreB}`).join(', ')}`;
      }
    }
    if (d.statusSummary) return d.statusSummary;
    return '';
  };

  const detailStr = getLiveStatusDetail();

  return (
    <div className="fixed top-[70px] left-0 w-full bg-gradient-to-r from-accent-red/90 to-card/95 border-b-2 border-accent-red z-45 shadow-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap justify-between items-center gap-3">
        
        {/* Info */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-red-600 text-text-bright font-score font-black text-[10px] px-2 py-0.5 rounded shadow-[0_0_8px_rgba(232,71,71,0.5)] animate-pulse inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-text-bright inline-block"></span> LIVE
          </span>
          <span className="font-display font-bold text-sm tracking-wide text-text-bright flex items-center gap-1.5">
            <span>{emoji}</span>
            <span>{liveMatch.sport}</span>
            <span className="text-text-bright/60">|</span>
            <span>{liveMatch.teamA?.name}</span>
            <span className="text-accent/80 font-normal">vs</span>
            <span>{liveMatch.teamB?.name}</span>
            <span className="text-text-bright/60">|</span>
            <span className="font-score text-accent font-extrabold text-xs md:text-sm tracking-widest bg-black/30 px-2 py-0.5 rounded">
              {liveMatch.sport === 'Cricket' 
                ? `${liveMatch.scoreA}/${liveMatch.detail?.wicketsA || 0} (${liveMatch.detail?.oversA || 0}.${liveMatch.detail?.ballsA || 0} Ov) – ${liveMatch.scoreB}/${liveMatch.detail?.wicketsB || 0} (${liveMatch.detail?.oversB || 0}.${liveMatch.detail?.ballsB || 0} Ov)`
                : `${liveMatch.scoreA} – ${liveMatch.scoreB}`
              }
            </span>
            {detailStr && (
              <span className="text-xs text-text-muted font-display font-bold ml-2 hidden lg:inline">
                ({detailStr})
              </span>
            )}
          </span>
        </div>
        {detailStr && (
          <div className="text-xs text-text-muted font-display font-bold w-full block lg:hidden px-1">
            {detailStr}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a
            href={liveMatch.youtubeUrl || 'https://youtube.com/live'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black/45 border border-accent-red/60 text-accent-red hover:bg-accent-red hover:text-text-bright hover:border-accent-red text-xs font-display font-bold uppercase tracking-wider px-3.5 py-1 rounded transition-all duration-200"
          >
            <i className="fa-brands fa-youtube mr-1.5"></i> Watch on YouTube
          </a>
          <button
            onClick={() => setVisible(false)}
            className="text-text-bright/60 hover:text-text-bright transition-colors p-1"
            aria-label="Close Live Banner"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LiveBanner;
