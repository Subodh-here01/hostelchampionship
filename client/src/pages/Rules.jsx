import React from 'react';
import { motion } from 'framer-motion';

const Rules = () => {
  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24 text-text-bright">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <span className="font-display font-bold uppercase tracking-widest text-accent text-sm block mb-1">
            CONSTITUTION & GUIDELINES
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-text-bright tracking-wide">
            OFFICIAL <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">RULES & TIMELINES</span>
          </h1>
          <p className="text-text-muted text-sm mt-2 max-w-xl">
            Official rules, timeline guidelines, point systems, and code of conduct for the 2026 MSRIT Hostel Sports Championship.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Rules Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Section 1: General Guidelines */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border/80 p-6 rounded-md shadow-lg"
            >
              <h3 className="font-display font-bold uppercase tracking-wide text-lg text-accent mb-4 flex items-center gap-2">
                <i className="fa-solid fa-scale-balanced"></i>
                1. General Guidelines
              </h3>
              <ul className="space-y-3 text-sm text-text-muted list-disc list-inside">
                <li>All players must be bonafide residents of the MSRIT Hostels (Aryabhatta Block, Freshers' Block, Ratan Tata Block, MSRIT PG Boys' Hostel).</li>
                <li>Players must produce their Hostel ID card before the commencement of every match. No ID card means no participation.</li>
                <li>Strict disciplinary action will be taken against teams/hostels engaging in unsportsmanlike behavior, verbal abuse, or physical altercations. Referees have full authority to disqualify players or teams.</li>
                <li>Decisions made by official referees, judges, and the Sports Council are final and binding. No protests against referee judgment calls will be entertained.</li>
                <li>Teams must report to the venue at least 15 minutes before the scheduled time. A walkover will be awarded if a team fails to show up within 10 minutes of the match time.</li>
              </ul>
            </motion.div>

            {/* Section 2: Timelines & Schedules */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border/80 p-6 rounded-md shadow-lg"
            >
              <h3 className="font-display font-bold uppercase tracking-wide text-lg text-accent-red mb-4 flex items-center gap-2">
                <i className="fa-solid fa-clock"></i>
                2. Tournament Timelines
              </h3>
              <div className="space-y-4">
                <div className="border-l-2 border-accent/40 pl-4 py-1">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider block">Phase 1: June 20 – June 28</span>
                  <p className="text-sm font-semibold text-text-bright">League Group Stage Matches</p>
                  <p className="text-xs text-text-muted mt-1">Teams compete in round-robin fixtures across all sports to qualify for the playoffs.</p>
                </div>
                <div className="border-l-2 border-accent-red/40 pl-4 py-1">
                  <span className="text-xs font-bold text-accent-red uppercase tracking-wider block">Phase 2: June 29 – July 3</span>
                  <p className="text-sm font-semibold text-text-bright">Playoffs & Semi-Finals</p>
                  <p className="text-xs text-text-muted mt-1">Top teams battle it out in knock-out clashes.</p>
                </div>
                <div className="border-l-2 border-accent-green/45 pl-4 py-1">
                  <span className="text-xs font-bold text-accent-green uppercase tracking-wider block">Phase 3: July 4 – July 8</span>
                  <p className="text-sm font-semibold text-text-bright">Grand Finals & Closing Ceremony</p>
                  <p className="text-xs text-text-muted mt-1">Championship title deciders and points distribution ceremony.</p>
                </div>
              </div>
            </motion.div>

            {/* Section 3: Sport Specific Rules */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border/80 p-6 rounded-md shadow-lg"
            >
              <h3 className="font-display font-bold uppercase tracking-wide text-lg text-text-bright mb-4 flex items-center gap-2">
                <i className="fa-solid fa-list-check"></i>
                3. Detailed Sport-Specific Rules
              </h3>
              <div className="space-y-6 text-sm text-text-muted">
                <div>
                  <h4 className="font-bold text-text-bright flex items-center gap-1.5 text-base">
                    <span>🏏</span> Cricket
                  </h4>
                  <ul className="list-disc list-inside mt-2 space-y-1.5 text-xs">
                    <li><strong>Format:</strong> T10 (10 overs per innings). Standard ICC T20 rules apply except where customized.</li>
                    <li><strong>Bowler Limit:</strong> Maximum of 2 overs per bowler.</li>
                    <li><strong>Powerplay:</strong> First 3 overs will be field-restricted powerplay (maximum 2 players outside the circle).</li>
                    <li><strong>No-Ball & Free Hit:</strong> Any over-stepping or height no-ball will result in a Free Hit on the next delivery.</li>
                    <li><strong>Tie-Breaker:</strong> In case of equal scores at the end of 10 overs, a <strong>Super Over</strong> will decide the winner. No draw results are possible.</li>
                  </ul>
                </div>
                
                <div className="border-t border-border/20 pt-4">
                  <h4 className="font-bold text-text-bright flex items-center gap-1.5 text-base">
                    <span>🏓</span> TT (Table Tennis)
                  </h4>
                  <ul className="list-disc list-inside mt-2 space-y-1.5 text-xs">
                    <li><strong>Format:</strong> Singles and Doubles fixtures. Standard ITTF guidelines apply.</li>
                    <li><strong>Scoring:</strong> Best of 5 sets per match. Each set is played to 11 points. The player must win by a margin of 2 points.</li>
                    <li><strong>Service:</strong> Service changes after every 2 points. In case of deuce (10-10), service changes after every point.</li>
                    <li><strong>Equipment:</strong> Players are encouraged to bring their own bats, but standard bats will be provided. Balls will be official tournament grade.</li>
                  </ul>
                </div>

                <div className="border-t border-border/20 pt-4">
                  <h4 className="font-bold text-text-bright flex items-center gap-1.5 text-base">
                    <span>🏸</span> Badminton
                  </h4>
                  <ul className="list-disc list-inside mt-2 space-y-1.5 text-xs">
                    <li><strong>Format:</strong> Men's Singles and Men's Doubles. BAI guidelines apply.</li>
                    <li><strong>Scoring:</strong> Best of 3 games of 21 points each. At 20-all, the side which gains a 2-point lead first wins the game. At 29-all, the side scoring the 30th point wins.</li>
                    <li><strong>Intervals:</strong> 60-second interval when the leading score reaches 11 points in any game, and a 120-second interval between games.</li>
                  </ul>
                </div>

                <div className="border-t border-border/20 pt-4">
                  <h4 className="font-bold text-text-bright flex items-center gap-1.5 text-base">
                    <span>♟️</span> Chess
                  </h4>
                  <ul className="list-disc list-inside mt-2 space-y-1.5 text-xs">
                    <li><strong>Format:</strong> FIDE rapid chess rules apply. 10 minutes time control per player (no increment).</li>
                    <li><strong>Illegal Moves:</strong> The first illegal move results in a warning, and the opponent gets 2 minutes extra time. A second illegal move results in forfeiture of the match.</li>
                    <li><strong>Tie-Breaker:</strong> If a game ends in a draw on the board (stalemate, 3-fold repetition, insufficient material), an <strong>Armageddon</strong> blitz game (5 mins for White, 4 mins for Black, Black has draw odds) will be played to declare a clear winner.</li>
                  </ul>
                </div>

                <div className="border-t border-border/20 pt-4">
                  <h4 className="font-bold text-text-bright flex items-center gap-1.5 text-base">
                    <span>🟤</span> Carrom
                  </h4>
                  <ul className="list-disc list-inside mt-2 space-y-1.5 text-xs">
                    <li><strong>Format:</strong> Singles and Doubles matches.</li>
                    <li><strong>Scoring:</strong> Played up to 29 points or 8 boards, whichever is reached earlier. White carries 2 points, Black carries 1 point, and the Queen carries 3 points (must be covered).</li>
                    <li><strong>Tie-Breaker:</strong> If points are tied after 8 boards, a single decider board will be played to declare the winner.</li>
                  </ul>
                </div>

                <div className="border-t border-border/20 pt-4">
                  <h4 className="font-bold text-text-bright flex items-center gap-1.5 text-base">
                    <span>🎮</span> BGMI
                  </h4>
                  <ul className="list-disc list-inside mt-2 space-y-1.5 text-xs">
                    <li><strong>Format:</strong> Battle Royale mode in custom private rooms. Squad matches.</li>
                    <li><strong>Scoring Matrix:</strong> Placements points + Finish (kill) points. Kills award 1 point each.</li>
                    <li><strong>Placements Points:</strong> 1st place: 10 pts, 2nd place: 6 pts, 3rd place: 5 pts, 4th place: 4 pts, 5th place: 3 pts, 6th place: 2 pts, 7th-8th place: 1 pt.</li>
                    <li><strong>Tie-Breaker:</strong> In case of identical total points across lobbies, total WWCDs (wins) will break the tie. If still tied, total finish points will decide the winner.</li>
                  </ul>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Point System Card Sidebar */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border p-6 rounded-md shadow-lg"
            >
              <h3 className="font-display font-bold uppercase tracking-wider text-text-bright text-base mb-4 flex items-center gap-2">
                <i className="fa-solid fa-award text-accent"></i>
                Overall Points Allocation
              </h3>
              
              <div className="space-y-4">
                {/* Unified Sport Standings Placement Points */}
                <div className="bg-base/40 border border-border/30 p-4 rounded-sm">
                  <div className="font-display font-bold text-text-bright mb-2 flex items-center gap-1.5">
                    🏆 All Sports Standings
                  </div>
                  <p className="text-[11px] text-text-muted mb-3">
                    Finishing standings positions at the end of the tournament for each sport award points towards the Overall Championship Leaderboard:
                  </p>
                  <ul className="space-y-1.5 text-xs text-text-muted">
                    <li className="flex justify-between border-b border-border/20 pb-1">
                      <span>Winner (1st Place)</span>
                      <span className="font-mono font-bold text-accent">10 pts</span>
                    </li>
                    <li className="flex justify-between border-b border-border/20 pb-1">
                      <span>Runner-up (2nd Place)</span>
                      <span className="font-mono font-bold text-accent-green">6 pts</span>
                    </li>
                    <li className="flex justify-between">
                      <span>3rd Place</span>
                      <span className="font-mono font-bold text-accent-red">3 pts</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 border-t border-border/30 pt-4">
                <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">Match Scoring</span>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Within individual sports, group stage match wins award **1 point for a win** and **0 points for a loss**. Draws are not permitted; tie-breaker protocols will run to declare a winner.
                </p>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Rules;
