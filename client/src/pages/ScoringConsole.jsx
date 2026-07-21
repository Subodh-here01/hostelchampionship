import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMatchById, updateMatchScore, undoMatchScore, updateMatch } from '../api/matches';
import CricketScorecard from '../components/CricketScorecard';

const ScoringConsole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  
  // Cricket Scoring Steps: 'setup' | 'opening' | 'live'
  const [scoringStep, setScoringStep] = useState('setup');

  // Step 1: Setup State
  const [tossWinner, setTossWinner] = useState(''); // 'A' or 'B'
  const [optedTo, setOptedTo] = useState('Bat'); // 'Bat' or 'Bowl'
  const [totalOvers, setTotalOvers] = useState(20);

  // Step 2: Opening Players State
  const [strikerInput, setStrikerInput] = useState('');
  const [nonStrikerInput, setNonStrikerInput] = useState('');
  const [bowlerInput, setBowlerInput] = useState('');

  // Step 3: Live Scoring Checkboxes & Selections
  const [cbWide, setCbWide] = useState(false);
  const [cbNoBall, setCbNoBall] = useState(false);
  const [cbByes, setCbByes] = useState(false);
  const [cbLegByes, setCbLegByes] = useState(false);
  const [cbWicket, setCbWicket] = useState(false);

  // Inline Player Edit States
  const [isEditingStriker, setIsEditingStriker] = useState(false);
  const [isEditingNonStriker, setIsEditingNonStriker] = useState(false);
  const [isEditingBowler, setIsEditingBowler] = useState(false);

  const [tempStriker, setTempStriker] = useState('');
  const [tempNonStriker, setTempNonStriker] = useState('');
  const [tempBowler, setTempBowler] = useState('');

  useEffect(() => {
    fetchMatch();
  }, [id]);

  const fetchMatch = async () => {
    setLoading(true);
    try {
      const res = await getMatchById(id);
      setMatch(res.data);
      const d = res.data.detail || {};
      
      // Determine step based on existing data
      if (d.striker && d.bowler) {
        setScoringStep('live');
      } else if (d.tossWinner) {
        setScoringStep('opening');
      } else {
        setScoringStep('setup');
      }

      // Pre-fill setup state if exists
      if (d.tossWinner) setTossWinner(d.tossWinner);
      if (d.optedTo) setOptedTo(d.optedTo);
      if (d.totalOvers) setTotalOvers(d.totalOvers);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to load match details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex flex-col justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-display uppercase tracking-widest text-accent text-sm">Loading Live Scorer Console...</p>
      </div>
    );
  }

  if (errorMsg || !match) {
    return (
      <div className="min-h-screen bg-base py-24 px-4">
        <div className="max-w-md mx-auto bg-card border border-accent-red/30 p-6 rounded text-center">
          <i className="fa-solid fa-circle-exclamation text-accent-red text-4xl mb-4"></i>
          <h2 className="font-display font-bold uppercase text-lg text-text-bright mb-2">Error</h2>
          <p className="text-sm text-text-muted mb-6">{errorMsg || 'Match not found.'}</p>
          <Link to="/admin/matches" className="bg-accent text-base font-display font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow">
            Back to Match Board
          </Link>
        </div>
      </div>
    );
  }

  const d = match.detail || {};

  // --- SCORE HANDLERS ---

  const handleUpdate = async (updatedScoreA, updatedScoreB, updatedDetail) => {
    setActionLoading(true);
    try {
      const res = await updateMatchScore(id, {
        scoreA: updatedScoreA,
        scoreB: updatedScoreB,
        detail: updatedDetail
      });
      setMatch(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to record score update.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUndo = async () => {
    if (!match.history || match.history.length === 0) {
      alert('No events available in history stack to undo.');
      return;
    }
    setActionLoading(true);
    try {
      const res = await undoMatchScore(id);
      setMatch(res.data);
      const updatedD = res.data.detail || {};
      if (updatedD.striker && updatedD.bowler) {
        setScoringStep('live');
      } else if (updatedD.tossWinner) {
        setScoringStep('opening');
      } else {
        setScoringStep('setup');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to undo last action.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteMatch = async (winnerTeamId) => {
    if (!winnerTeamId) return;
    setActionLoading(true);
    try {
      const res = await updateMatch(id, {
        status: 'Completed',
        winner: winnerTeamId
      });
      setMatch(res.data);
      alert('Match completed successfully! Ranks and Standings have been updated.');
      navigate('/admin/matches');
    } catch (err) {
      console.error(err);
      alert('Failed to complete match.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- CRICKET CORE ENGINE HANDLERS ---

  const initCricketInningsData = (detailObj, inn) => {
    const battingKey = inn === 'A' ? 'battingA' : 'battingB';
    const bowlingKey = inn === 'A' ? 'bowlingA' : 'bowlingB';
    const extrasKey = inn === 'A' ? 'extrasA' : 'extrasB';
    const fowKey = inn === 'A' ? 'fowA' : 'fowB';
    const runsKey = inn === 'A' ? 'runsA' : 'runsB';
    const wicketsKey = inn === 'A' ? 'wicketsA' : 'wicketsB';
    const oversKey = inn === 'A' ? 'oversA' : 'oversB';
    const ballsKey = inn === 'A' ? 'ballsA' : 'ballsB';

    if (!detailObj[battingKey]) detailObj[battingKey] = [];
    if (!detailObj[bowlingKey]) detailObj[bowlingKey] = [];
    if (!detailObj[extrasKey]) detailObj[extrasKey] = { wd: 0, nb: 0, b: 0, lb: 0, total: 0 };
    if (!detailObj[fowKey]) detailObj[fowKey] = [];
    if (detailObj[runsKey] === undefined) detailObj[runsKey] = 0;
    if (detailObj[wicketsKey] === undefined) detailObj[wicketsKey] = 0;
    if (detailObj[oversKey] === undefined) detailObj[oversKey] = 0;
    if (detailObj[ballsKey] === undefined) detailObj[ballsKey] = 0;
  };

  const getOrAddPlayer = (list, name, isBatter = true) => {
    let player = list.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (!player) {
      player = isBatter 
        ? { name: name.trim(), runs: 0, balls: 0, fours: 0, sixes: 0, out: false, howOut: '' }
        : { name: name.trim(), overs: 0, balls: 0, runs: 0, wickets: 0, nb: 0, wd: 0, maidens: 0 };
      list.push(player);
    }
    return player;
  };

  // Step 1: Submit Setup
  const handleStartMatchSetup = () => {
    if (!tossWinner) {
      alert('Please select which team won the toss.');
      return;
    }
    const detailObj = { ...(match.detail || {}) };
    detailObj.tossWinner = tossWinner;
    detailObj.optedTo = optedTo;
    detailObj.totalOvers = totalOvers;

    // Determine who bats first
    // Team A won toss & opted to Bat => Team A bats first
    // Team A won toss & opted to Bowl => Team B bats first
    // Team B won toss & opted to Bat => Team B bats first
    // Team B won toss & opted to Bowl => Team A bats first
    if ((tossWinner === 'A' && optedTo === 'Bat') || (tossWinner === 'B' && optedTo === 'Bowl')) {
      detailObj.currentInnings = 'A';
    } else {
      detailObj.currentInnings = 'B';
    }

    initCricketInningsData(detailObj, 'A');
    initCricketInningsData(detailObj, 'B');
    detailObj.currentOverDeliveries = [];

    handleUpdate(0, 0, detailObj);
    setScoringStep('opening');
  };

  // Step 2: Submit Opening Players
  const handleStartOpeningPlayers = () => {
    if (!strikerInput.trim() || !nonStrikerInput.trim() || !bowlerInput.trim()) {
      alert('Please fill Striker, Non-Striker, and Bowler names.');
      return;
    }

    const detailObj = { ...(match.detail || {}) };
    const inn = detailObj.currentInnings || 'A';
    initCricketInningsData(detailObj, inn);

    const battingKey = inn === 'A' ? 'battingA' : 'battingB';
    const bowlingKey = inn === 'A' ? 'bowlingA' : 'bowlingB';

    getOrAddPlayer(detailObj[battingKey], strikerInput, true);
    getOrAddPlayer(detailObj[battingKey], nonStrikerInput, true);
    getOrAddPlayer(detailObj[bowlingKey], bowlerInput, false);

    detailObj.striker = strikerInput.trim();
    detailObj.nonStriker = nonStrikerInput.trim();
    detailObj.bowler = bowlerInput.trim();

    handleUpdate(detailObj.runsA || 0, detailObj.runsB || 0, detailObj);
    setScoringStep('live');
  };

  // Step 3: Record Delivery
  const handleRecordBall = (runsVal) => {
    const detailObj = { ...(match.detail || {}) };
    const inn = detailObj.currentInnings || 'A';
    initCricketInningsData(detailObj, inn);

    const battingKey = inn === 'A' ? 'battingA' : 'battingB';
    const bowlingKey = inn === 'A' ? 'bowlingA' : 'bowlingB';
    const extrasKey = inn === 'A' ? 'extrasA' : 'extrasB';
    const fowKey = inn === 'A' ? 'fowA' : 'fowB';
    const runsKey = inn === 'A' ? 'runsA' : 'runsB';
    const wicketsKey = inn === 'A' ? 'wicketsA' : 'wicketsB';
    const oversKey = inn === 'A' ? 'oversA' : 'oversB';
    const ballsKey = inn === 'A' ? 'ballsA' : 'ballsB';

    if (!detailObj.striker || !detailObj.bowler) {
      alert('Active Striker and Bowler configuration missing.');
      return;
    }

    const striker = getOrAddPlayer(detailObj[battingKey], detailObj.striker, true);
    const nonStriker = getOrAddPlayer(detailObj[battingKey], detailObj.nonStriker, true);
    const bowler = getOrAddPlayer(detailObj[bowlingKey], detailObj.bowler, false);

    let isOverComplete = false;
    let label = '';

    // Calculate runs and extras
    let totalRunsForBall = runsVal;
    let isExtra = cbWide || cbNoBall || cbByes || cbLegByes;

    if (cbWide) {
      // Wide Ball
      detailObj[runsKey] += (1 + runsVal);
      detailObj[extrasKey].wd += (1 + runsVal);
      detailObj[extrasKey].total += (1 + runsVal);
      bowler.runs += (1 + runsVal);
      label = runsVal > 0 ? `${runsVal}wd` : 'wd';
    } else if (cbNoBall) {
      // No Ball
      detailObj[runsKey] += (1 + runsVal);
      detailObj[extrasKey].nb += 1;
      detailObj[extrasKey].total += 1;
      bowler.runs += (1 + runsVal);
      
      // Runs scored off no ball go to batter
      striker.runs += runsVal;
      striker.balls += 1;
      if (runsVal === 4) striker.fours += 1;
      if (runsVal === 6) striker.sixes += 1;
      
      label = runsVal > 0 ? `${runsVal}nb` : 'nb';
      detailObj[ballsKey] += 1;
      bowler.balls += 1;
    } else {
      // Normal Ball or Byes/Leg Byes
      detailObj[runsKey] += runsVal;
      if (!cbByes && !cbLegByes) {
        bowler.runs += runsVal;
      }
      detailObj[ballsKey] += 1;
      bowler.balls += 1;
      
      if (cbByes) {
        detailObj[extrasKey].b += runsVal;
        detailObj[extrasKey].total += runsVal;
        striker.balls += 1;
        label = `${runsVal}b`;
      } else if (cbLegByes) {
        detailObj[extrasKey].lb += runsVal;
        detailObj[extrasKey].total += runsVal;
        striker.balls += 1;
        label = `${runsVal}lb`;
      } else {
        // Standard runs to batter
        striker.runs += runsVal;
        striker.balls += 1;
        if (runsVal === 4) striker.fours += 1;
        if (runsVal === 6) striker.sixes += 1;
        label = runsVal === 0 ? '0' : `${runsVal}`;
      }
    }

    // Wicket Logging
    if (cbWicket) {
      striker.out = true;
      striker.howOut = `b ${bowler.name}`;
      bowler.wickets += 1;
      detailObj[wicketsKey] += 1;
      
      detailObj[fowKey].push({
        wickets: detailObj[wicketsKey],
        score: detailObj[runsKey],
        name: striker.name,
        over: `${detailObj[oversKey]}.${detailObj[ballsKey]}`
      });

      label = 'W';
      detailObj.striker = '';
      setStrikerInput('');
    }

    // Append to current over timeline
    if (!detailObj.currentOverDeliveries) detailObj.currentOverDeliveries = [];
    detailObj.currentOverDeliveries.push(label);

    // Strike Rotation on odd runs (if not extra runs that don't rotate strike, e.g. legbyes/byes rotate normally)
    if (!cbWide && runsVal % 2 !== 0) {
      const temp = detailObj.striker;
      detailObj.striker = detailObj.nonStriker;
      detailObj.nonStriker = temp;
    }

    // Over Completion Logic (6 balls = 1 over)
    if (detailObj[ballsKey] >= 6) {
      detailObj[oversKey] += 1;
      detailObj[ballsKey] = 0;
      isOverComplete = true;

      // Bowler completed over
      bowler.overs += 1;
      bowler.balls = 0;
      detailObj.bowler = '';
      setBowlerInput('');

      // Rotate strike at end of over
      if (detailObj.striker && detailObj.nonStriker) {
        const temp = detailObj.striker;
        detailObj.striker = detailObj.nonStriker;
        detailObj.nonStriker = temp;
      }
    } else {
      bowler.balls = detailObj[ballsKey];
      bowler.overs = detailObj[oversKey];
    }

    // Reset Checkboxes
    setCbWide(false);
    setCbNoBall(false);
    setCbByes(false);
    setCbLegByes(false);
    setCbWicket(false);

    // Save Live Scoring State
    handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);

    if (cbWicket) {
      const name = prompt('Batsman Out! Enter name of the incoming Batsman:');
      if (name && name.trim()) {
        getOrAddPlayer(detailObj[battingKey], name, true);
        detailObj.striker = name.trim();
        handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);
      }
    }

    if (isOverComplete) {
      // Clear deliveries list for next over
      detailObj.currentOverDeliveries = [];
      handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);
      alert('Over complete! Select a new Bowler.');
    }
  };

  const handleSwapBatsmen = () => {
    const detailObj = { ...(match.detail || {}) };
    if (!detailObj.striker || !detailObj.nonStriker) return;
    const temp = detailObj.striker;
    detailObj.striker = detailObj.nonStriker;
    detailObj.nonStriker = temp;
    handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);
  };

  const saveStriker = () => {
    if (!tempStriker.trim()) return;
    const detailObj = { ...(match.detail || {}) };
    const inn = detailObj.currentInnings || 'A';
    const battingKey = inn === 'A' ? 'battingA' : 'battingB';
    getOrAddPlayer(detailObj[battingKey], tempStriker, true);
    detailObj.striker = tempStriker.trim();
    handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);
    setIsEditingStriker(false);
  };

  const saveNonStriker = () => {
    if (!tempNonStriker.trim()) return;
    const detailObj = { ...(match.detail || {}) };
    const inn = detailObj.currentInnings || 'A';
    const battingKey = inn === 'A' ? 'battingA' : 'battingB';
    getOrAddPlayer(detailObj[battingKey], tempNonStriker, true);
    detailObj.nonStriker = tempNonStriker.trim();
    handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);
    setIsEditingNonStriker(false);
  };

  const saveBowler = () => {
    if (!tempBowler.trim()) return;
    const detailObj = { ...(match.detail || {}) };
    const inn = detailObj.currentInnings || 'A';
    const bowlingKey = inn === 'A' ? 'bowlingA' : 'bowlingB';
    getOrAddPlayer(detailObj[bowlingKey], tempBowler, false);
    detailObj.bowler = tempBowler.trim();
    handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);
    setIsEditingBowler(false);
  };

  const handleRetireBatsman = () => {
    const nameToRetire = prompt('Enter the name of the batsman to retire (Striker or Non-Striker):');
    if (!nameToRetire) return;

    const detailObj = { ...(match.detail || {}) };
    const inn = detailObj.currentInnings || 'A';
    const battingKey = inn === 'A' ? 'battingA' : 'battingB';

    let list = detailObj[battingKey] || [];
    let p = list.find(x => x.name.toLowerCase() === nameToRetire.trim().toLowerCase());
    
    if (!p) {
      alert('Player not found in batting list.');
      return;
    }

    p.out = true;
    p.howOut = 'retired hurt';

    if (detailObj.striker && detailObj.striker.toLowerCase() === nameToRetire.trim().toLowerCase()) {
      detailObj.striker = '';
      setStrikerInput('');
    } else if (detailObj.nonStriker && detailObj.nonStriker.toLowerCase() === nameToRetire.trim().toLowerCase()) {
      detailObj.nonStriker = '';
      setNonStrikerInput('');
    }

    handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);

    const replacement = prompt('Enter the name of the new Batsman:');
    if (replacement && replacement.trim()) {
      getOrAddPlayer(detailObj[battingKey], replacement, true);
      if (!detailObj.striker) {
        detailObj.striker = replacement.trim();
      } else {
        detailObj.nonStriker = replacement.trim();
      }
      handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);
    }
  };

  const handleSwitchInnings = () => {
    const detailObj = { ...(match.detail || {}) };
    const nextInn = detailObj.currentInnings === 'A' ? 'B' : 'A';
    detailObj.currentInnings = nextInn;
    detailObj.striker = '';
    detailObj.nonStriker = '';
    detailObj.bowler = '';
    detailObj.currentOverDeliveries = [];
    
    setStrikerInput('');
    setNonStrikerInput('');
    setBowlerInput('');
    setScoringStep('opening');

    handleUpdate(detailObj.runsA, detailObj.runsB, detailObj);
  };

  // --- OTHER SPORTS SCORING ENGINES ---

  const scoreSets = (teamSide) => {
    const detailObj = { ...(match.detail || {}) };
    if (!detailObj.sets) detailObj.sets = [{ scoreA: 0, scoreB: 0 }];
    if (detailObj.setsWonA === undefined) detailObj.setsWonA = 0;
    if (detailObj.setsWonB === undefined) detailObj.setsWonB = 0;

    const currentSetIndex = detailObj.sets.length - 1;
    const currentSet = { ...detailObj.sets[currentSetIndex] };

    if (teamSide === 'A') {
      currentSet.scoreA += 1;
    } else {
      currentSet.scoreB += 1;
    }
    detailObj.sets[currentSetIndex] = currentSet;

    const targetPoints = match.sport === 'TT' ? 11 : 21;
    const isCompleted = (currentSet.scoreA >= targetPoints || currentSet.scoreB >= targetPoints) &&
                        Math.abs(currentSet.scoreA - currentSet.scoreB) >= 2;

    if (isCompleted) {
      if (currentSet.scoreA > currentSet.scoreB) {
        detailObj.setsWonA += 1;
      } else {
        detailObj.setsWonB += 1;
      }
      
      const setsNeeded = match.sport === 'TT' ? 3 : 2;
      if (detailObj.setsWonA < setsNeeded && detailObj.setsWonB < setsNeeded) {
        detailObj.sets.push({ scoreA: 0, scoreB: 0 });
      }
    }

    handleUpdate(detailObj.setsWonA, detailObj.setsWonB, detailObj);
  };

  const incrementScore = (teamSide, amount) => {
    const detailObj = { ...(match.detail || {}) };
    let newScoreA = match.scoreA;
    let newScoreB = match.scoreB;

    if (teamSide === 'A') {
      newScoreA = Math.max(0, newScoreA + amount);
    } else {
      newScoreB = Math.max(0, newScoreB + amount);
    }

    detailObj.statusSummary = `${match.teamA?.name} ${newScoreA} – ${match.teamB?.name} ${newScoreB}`;
    handleUpdate(newScoreA, newScoreB, detailObj);
  };

  // Helper variables for Live Scoring Step
  const inn = d.currentInnings || 'A';
  const runs = inn === 'A' ? d.runsA || 0 : d.runsB || 0;
  const wickets = inn === 'A' ? d.wicketsA || 0 : d.wicketsB || 0;
  const overs = inn === 'A' ? d.oversA || 0 : d.oversB || 0;
  const balls = inn === 'A' ? d.ballsA || 0 : d.ballsB || 0;
  const totalBalls = (overs * 6) + balls;
  const crr = totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00';

  const listBatting = inn === 'A' ? d.battingA || [] : d.battingB || [];
  const listBowling = inn === 'A' ? d.bowlingA || [] : d.bowlingB || [];

  const strikerPlayer = listBatting.find(p => p.name === d.striker) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
  const nonStrikerPlayer = listBatting.find(p => p.name === d.nonStriker) || { runs: 0, balls: 0, fours: 0, sixes: 0 };
  const currentBowlerPlayer = listBowling.find(p => p.name === d.bowler) || { overs: 0, balls: 0, runs: 0, wickets: 0 };

  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24 text-text-bright">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link to="/admin/matches" className="text-text-muted hover:text-accent font-display text-xs uppercase tracking-wider font-bold inline-flex items-center gap-1.5">
            <i className="fa-solid fa-arrow-left"></i> Back to match listing
          </Link>
        </div>

        {/* Match Header */}
        <div className="bg-card border border-border/80 p-6 rounded-md shadow-xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <span className="bg-accent/10 border border-accent/25 text-accent text-[10px] font-score font-bold tracking-wider px-2 py-0.5 rounded">
                LIVE SCOREKEEPER
              </span>
              <h1 className="font-display font-black text-2xl uppercase mt-2 text-text-bright flex items-center gap-2">
                <span>{match.sport} Match</span>
              </h1>
              <p className="text-xs text-text-muted mt-1">
                Venue: {match.venue} • Scheduled: {new Date(match.date).toLocaleString()}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleUndo} 
                disabled={actionLoading || !match.history || match.history.length === 0}
                className="bg-muted hover:bg-muted/80 text-text-bright text-xs font-display font-bold uppercase tracking-wider px-4 py-2 border border-border rounded flex items-center gap-1.5 disabled:opacity-40 transition-colors"
              >
                <i className="fa-solid fa-rotate-left"></i> Undo Play
              </button>
            </div>
          </div>
        </div>

        {/* Live Head-to-Head Scoreboard */}
        <div className="bg-card border border-border/80 p-8 rounded-md shadow-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">
            
            {/* Team A */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mx-auto shadow-md" style={{ backgroundColor: `${match.teamA?.color}20` }}>
                {match.teamA?.emoji}
              </div>
              <h3 className="font-display font-extrabold text-lg mt-3 text-text-bright truncate">{match.teamA?.name}</h3>
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{match.teamA?.hostelBlock}</span>
            </div>

            {/* Score Center */}
            <div className="text-center">
              <div className="font-score text-2xl md:text-4xl font-black text-accent tracking-wider flex flex-col md:flex-row items-center justify-center gap-3">
                <span>
                  {match.sport === 'Cricket' 
                    ? `${match.scoreA}/${match.detail?.wicketsA || 0} (${match.detail?.oversA || 0}.${match.detail?.ballsA || 0} Ov)`
                    : match.scoreA
                  }
                </span>
                <span className="text-text-muted text-xl font-light font-display">VS</span>
                <span>
                  {match.sport === 'Cricket' 
                    ? `${match.scoreB}/${match.detail?.wicketsB || 0} (${match.detail?.oversB || 0}.${match.detail?.ballsB || 0} Ov)`
                    : match.scoreB
                  }
                </span>
              </div>
              <span className="bg-red-600/10 border border-red-600/35 text-red-500 font-score font-bold text-[10px] px-2 py-0.5 rounded shadow mt-3 inline-block animate-pulse">
                {match.status.toUpperCase()}
              </span>
            </div>

            {/* Team B */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mx-auto shadow-md" style={{ backgroundColor: `${match.teamB?.color}20` }}>
                {match.teamB?.emoji}
              </div>
              <h3 className="font-display font-extrabold text-lg mt-3 text-text-bright truncate">{match.teamB?.name}</h3>
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">{match.teamB?.hostelBlock}</span>
            </div>

          </div>
        </div>

        {/* CRICKET SCORER PANEL */}
        {match.sport === 'Cricket' && (
          <div className="space-y-6">
            
            {/* STEP 1: SETUP PANEL */}
            {scoringStep === 'setup' && (
              <div className="bg-card border border-border/80 p-6 rounded-md shadow-xl space-y-6">
                <h3 className="font-display font-black text-sm uppercase text-accent tracking-wider border-b border-border/20 pb-3">
                  Match Setup / Toss Config
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Toss Winner */}
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted font-display font-bold uppercase tracking-wider block">Toss won by?</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setTossWinner('A')}
                        className={`flex-1 py-3 border rounded text-xs font-bold font-display uppercase transition-colors ${
                          tossWinner === 'A' ? 'bg-accent border-accent text-base' : 'bg-muted border-border text-text-muted'
                        }`}
                      >
                        {match.teamA?.name}
                      </button>
                      <button 
                        onClick={() => setTossWinner('B')}
                        className={`flex-1 py-3 border rounded text-xs font-bold font-display uppercase transition-colors ${
                          tossWinner === 'B' ? 'bg-accent border-accent text-base' : 'bg-muted border-border text-text-muted'
                        }`}
                      >
                        {match.teamB?.name}
                      </button>
                    </div>
                  </div>

                  {/* Opted to */}
                  <div className="space-y-2">
                    <label className="text-xs text-text-muted font-display font-bold uppercase tracking-wider block">Opted to?</label>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setOptedTo('Bat')}
                        className={`flex-1 py-3 border rounded text-xs font-bold font-display uppercase transition-colors ${
                          optedTo === 'Bat' ? 'bg-accent border-accent text-base' : 'bg-muted border-border text-text-muted'
                        }`}
                      >
                        🏏 Bat
                      </button>
                      <button 
                        onClick={() => setOptedTo('Bowl')}
                        className={`flex-1 py-3 border rounded text-xs font-bold font-display uppercase transition-colors ${
                          optedTo === 'Bowl' ? 'bg-accent border-accent text-base' : 'bg-muted border-border text-text-muted'
                        }`}
                      >
                        🥎 Bowl
                      </button>
                    </div>
                  </div>
                </div>

                {/* Overs */}
                <div className="flex flex-col gap-1.5 max-w-xs">
                  <label className="text-xs text-text-muted font-display font-bold uppercase tracking-wider">Overs?</label>
                  <input 
                    type="number" 
                    value={totalOvers}
                    onChange={(e) => setTotalOvers(Number(e.target.value))}
                    className="bg-[#0E0E12] border border-border text-text-bright rounded px-3 py-2 text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                <button 
                  onClick={handleStartMatchSetup}
                  className="w-full py-3.5 bg-accent text-base font-display font-bold uppercase tracking-wider rounded shadow-lg transition-colors hover:bg-accent/90"
                >
                  Start Match Setup
                </button>
              </div>
            )}

            {/* STEP 2: OPENING PLAYERS SETUP */}
            {scoringStep === 'opening' && (
              <div className="bg-card border border-border/80 p-6 rounded-md shadow-xl space-y-6">
                <h3 className="font-display font-black text-sm uppercase text-accent tracking-wider border-b border-border/20 pb-3">
                  Select Opening Players ({inn === 'A' ? match.teamA?.name : match.teamB?.name} Batting)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-display font-bold uppercase tracking-wider">Striker</label>
                    <input 
                      type="text" 
                      placeholder="Player Name"
                      value={strikerInput}
                      onChange={(e) => setStrikerInput(e.target.value)}
                      className="bg-[#0E0E12] border border-border text-text-bright rounded px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-display font-bold uppercase tracking-wider">Non-striker</label>
                    <input 
                      type="text" 
                      placeholder="Player Name"
                      value={nonStrikerInput}
                      onChange={(e) => setNonStrikerInput(e.target.value)}
                      className="bg-[#0E0E12] border border-border text-text-bright rounded px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs text-text-muted font-display font-bold uppercase tracking-wider">Opening Bowler</label>
                    <input 
                      type="text" 
                      placeholder="Player Name"
                      value={bowlerInput}
                      onChange={(e) => setBowlerInput(e.target.value)}
                      className="bg-[#0E0E12] border border-border text-text-bright rounded px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleStartOpeningPlayers}
                  className="w-full py-3.5 bg-accent text-base font-display font-bold uppercase tracking-wider rounded shadow-lg transition-colors hover:bg-accent/90"
                >
                  Start Innings
                </button>
              </div>
            )}

            {/* STEP 3: MAIN LIVE SCORER CONSOLE */}
            {scoringStep === 'live' && (
              <div className="space-y-6">
                
                {/* Scoring Header Banner */}
                <div className="bg-card border border-border/80 p-5 rounded-md flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <span className="text-[10px] text-accent font-display font-bold uppercase tracking-wider">
                      {inn === 'A' ? match.teamA?.name : match.teamB?.name}, 1st Innings
                    </span>
                    <h2 className="font-score font-black text-3xl text-text-bright mt-1">
                      {runs} - {wickets} <span className="text-sm font-normal text-text-muted">({overs}.{balls})</span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-text-muted font-display uppercase block tracking-wider">CRR</span>
                    <span className="font-mono text-xl font-bold text-text-bright block">{crr}</span>
                  </div>
                </div>

                {/* Batter & Bowler stats card */}
                <div className="bg-card border border-border/80 rounded-md overflow-hidden text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/30">
                    
                    {/* Batters */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-5 text-[9px] uppercase font-bold text-text-muted pb-1 border-b border-border/10">
                        <span className="col-span-2">Batsman</span>
                        <span className="text-center">R</span>
                        <span className="text-center">B</span>
                        <span className="text-center">4s / 6s</span>
                      </div>
                      
                      {/* Striker */}
                      <div className="grid grid-cols-5 font-semibold text-text-bright items-center min-h-[36px]">
                        <span className="col-span-2 text-accent flex items-center gap-1.5">
                          {isEditingStriker ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                list="available-batters"
                                value={tempStriker} 
                                onChange={(e) => setTempStriker(e.target.value)} 
                                placeholder="Striker"
                                className="bg-[#0E0E12] border border-border text-text-bright rounded px-2 py-1 text-xs w-28 focus:outline-none focus:border-accent"
                                autoFocus
                              />
                              <button onClick={saveStriker} className="bg-accent-green hover:bg-accent-green/80 text-base font-black px-1.5 py-0.5 rounded text-[10px]" title="Save">✓</button>
                              <button onClick={() => setIsEditingStriker(false)} className="bg-muted hover:bg-muted/80 text-text-bright px-1.5 py-0.5 rounded text-[10px]" title="Cancel">✗</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group">
                              <span className="font-bold">🏏 {d.striker || <span className="text-accent-red italic font-normal">[No Striker]</span>}*</span>
                              <button 
                                onClick={() => { setTempStriker(d.striker || ''); setIsEditingStriker(true); }}
                                className="text-text-muted hover:text-accent opacity-60 group-hover:opacity-100 transition-opacity"
                                title="Edit Striker"
                              >
                                <i className="fa-solid fa-pen text-[10px]"></i>
                              </button>
                            </div>
                          )}
                        </span>
                        <span className="text-center font-bold">{strikerPlayer.runs}</span>
                        <span className="text-center">{strikerPlayer.balls}</span>
                        <span className="text-center">{strikerPlayer.fours} / {strikerPlayer.sixes}</span>
                      </div>

                      {/* Non-Striker */}
                      <div className="grid grid-cols-5 font-semibold text-text-muted items-center min-h-[36px]">
                        <span className="col-span-2 flex items-center gap-1.5">
                          {isEditingNonStriker ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                list="available-batters"
                                value={tempNonStriker} 
                                onChange={(e) => setTempNonStriker(e.target.value)} 
                                placeholder="Non-Striker"
                                className="bg-[#0E0E12] border border-border text-text-bright rounded px-2 py-1 text-xs w-28 focus:outline-none focus:border-accent"
                                autoFocus
                              />
                              <button onClick={saveNonStriker} className="bg-accent-green hover:bg-accent-green/80 text-base font-black px-1.5 py-0.5 rounded text-[10px]" title="Save">✓</button>
                              <button onClick={() => setIsEditingNonStriker(false)} className="bg-muted hover:bg-muted/80 text-text-bright px-1.5 py-0.5 rounded text-[10px]" title="Cancel">✗</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group">
                              <span className="font-bold">{d.nonStriker || <span className="text-accent-red italic font-normal">[No Non-Striker]</span>}</span>
                              <button 
                                onClick={() => { setTempNonStriker(d.nonStriker || ''); setIsEditingNonStriker(true); }}
                                className="text-text-muted hover:text-accent opacity-60 group-hover:opacity-100 transition-opacity"
                                title="Edit Non-Striker"
                              >
                                <i className="fa-solid fa-pen text-[10px]"></i>
                              </button>
                            </div>
                          )}
                        </span>
                        <span className="text-center font-bold text-text-bright">{nonStrikerPlayer.runs}</span>
                        <span className="text-center">{nonStrikerPlayer.balls}</span>
                        <span className="text-center">{nonStrikerPlayer.fours} / {nonStrikerPlayer.sixes}</span>
                      </div>
                    </div>

                    {/* Bowler */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-5 text-[9px] uppercase font-bold text-text-muted pb-1 border-b border-border/10">
                        <span className="col-span-2">Bowler</span>
                        <span className="text-center">O</span>
                        <span className="text-center">R</span>
                        <span className="text-center">W</span>
                      </div>
                      
                      <div className="grid grid-cols-5 font-semibold text-text-bright items-center min-h-[36px]">
                        <span className="col-span-2 text-accent-green flex items-center gap-1.5">
                          {isEditingBowler ? (
                            <div className="flex items-center gap-1">
                              <input 
                                type="text" 
                                list="available-bowlers"
                                value={tempBowler} 
                                onChange={(e) => setTempBowler(e.target.value)} 
                                placeholder="Bowler"
                                className="bg-[#0E0E12] border border-border text-text-bright rounded px-2 py-1 text-xs w-28 focus:outline-none focus:border-accent"
                                autoFocus
                              />
                              <button onClick={saveBowler} className="bg-accent-green hover:bg-accent-green/80 text-base font-black px-1.5 py-0.5 rounded text-[10px]" title="Save">✓</button>
                              <button onClick={() => setIsEditingBowler(false)} className="bg-muted hover:bg-muted/80 text-text-bright px-1.5 py-0.5 rounded text-[10px]" title="Cancel">✗</button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group">
                              <span className="font-bold">{d.bowler || <span className="text-accent-red italic font-normal">[No Bowler]</span>}</span>
                              <button 
                                onClick={() => { setTempBowler(d.bowler || ''); setIsEditingBowler(true); }}
                                className="text-text-muted hover:text-accent opacity-60 group-hover:opacity-100 transition-opacity"
                                title="Edit Bowler"
                              >
                                <i className="fa-solid fa-pen text-[10px]"></i>
                              </button>
                            </div>
                          )}
                        </span>
                        <span className="text-center">{currentBowlerPlayer.overs}.{currentBowlerPlayer.balls}</span>
                        <span className="text-center font-bold">{currentBowlerPlayer.runs}</span>
                        <span className="text-center font-bold text-accent-green">{currentBowlerPlayer.wickets}</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* This Over Deliveries list */}
                <div className="bg-[#0E0E12] border border-border/40 p-4 rounded-md flex items-center justify-between">
                  <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">This over:</span>
                  <div className="flex gap-2">
                    {(d.currentOverDeliveries || []).map((delivery, idx) => (
                      <span 
                        key={idx} 
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          delivery === 'W' 
                            ? 'bg-accent-red text-text-bright' 
                            : delivery.includes('wd') || delivery.includes('nb')
                              ? 'bg-accent/20 border border-accent/40 text-accent'
                              : 'bg-muted border border-border text-text-bright'
                        }`}
                      >
                        {delivery}
                      </span>
                    ))}
                    {(!d.currentOverDeliveries || d.currentOverDeliveries.length === 0) && (
                      <span className="text-xs text-text-muted italic">Waiting first ball...</span>
                    )}
                  </div>
                </div>

                {/* Checkboxes Group */}
                <div className="bg-card border border-border/80 p-4 rounded-md grid grid-cols-2 md:grid-cols-5 gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-text-bright cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cbWide}
                      onChange={(e) => {
                        setCbWide(e.target.checked);
                        if (e.target.checked) {
                          setCbNoBall(false);
                          setCbByes(false);
                          setCbLegByes(false);
                        }
                      }}
                      className="accent-accent w-4 h-4"
                    />
                    <span>Wide</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-text-bright cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cbNoBall}
                      onChange={(e) => {
                        setCbNoBall(e.target.checked);
                        if (e.target.checked) {
                          setCbWide(false);
                          setCbByes(false);
                          setCbLegByes(false);
                        }
                      }}
                      className="accent-accent w-4 h-4"
                    />
                    <span>No Ball</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-text-bright cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cbByes}
                      onChange={(e) => {
                        setCbByes(e.target.checked);
                        if (e.target.checked) {
                          setCbWide(false);
                          setCbNoBall(false);
                          setCbLegByes(false);
                        }
                      }}
                      className="accent-accent w-4 h-4"
                    />
                    <span>Byes</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-text-bright cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cbLegByes}
                      onChange={(e) => {
                        setCbLegByes(e.target.checked);
                        if (e.target.checked) {
                          setCbWide(false);
                          setCbNoBall(false);
                          setCbByes(false);
                        }
                      }}
                      className="accent-accent w-4 h-4"
                    />
                    <span>Leg Byes</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-accent-red cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={cbWicket}
                      onChange={(e) => setCbWicket(e.target.checked)}
                      className="accent-accent-red w-4 h-4"
                    />
                    <span>Wicket</span>
                  </label>
                </div>

                {/* Live Scoring Console Buttons Panel */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  
                  {/* Left Side Sidebars */}
                  <div className="md:col-span-1 flex flex-col gap-3">
                    <button 
                      onClick={handleUndo}
                      disabled={!match.history || match.history.length === 0}
                      className="w-full py-3 bg-[#111116] border border-border/80 hover:border-accent font-display text-xs font-bold uppercase tracking-wider text-text-bright rounded shadow transition-all disabled:opacity-40"
                    >
                      <i className="fa-solid fa-rotate-left mr-1.5"></i> Undo
                    </button>
                    <button 
                      onClick={handleSwapBatsmen}
                      className="w-full py-3 bg-[#111116] border border-border/80 hover:border-accent font-display text-xs font-bold uppercase tracking-wider text-text-bright rounded shadow transition-all"
                    >
                      🔄 Swap Strike
                    </button>
                    <button 
                      onClick={handleRetireBatsman}
                      className="w-full py-3 bg-accent-red/10 border border-accent-red/35 hover:bg-accent-red text-accent-red hover:text-text-bright font-display text-xs font-bold uppercase tracking-wider rounded shadow transition-all"
                    >
                      🚑 Retire Hurt
                    </button>
                    <button 
                      onClick={handleSwitchInnings}
                      className="w-full py-3 bg-accent/15 border border-accent/40 text-accent font-display text-xs font-bold uppercase tracking-wider rounded shadow transition-all"
                    >
                      🏏 Next Innings
                    </button>
                  </div>

                  {/* Runs Circle Buttons Grid */}
                  <div className="md:col-span-3 bg-card border border-border/80 p-5 rounded-md flex flex-col justify-center items-center gap-4">
                    <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider select-none">Log Runs Bowled</span>
                    
                    <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
                      {[0, 1, 2, 3].map(val => (
                        <button 
                          key={val}
                          onClick={() => handleRecordBall(val)}
                          disabled={actionLoading}
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-muted border border-border hover:border-accent hover:text-accent font-score font-black text-lg flex items-center justify-center transition-all mx-auto"
                        >
                          {val}
                        </button>
                      ))}
                      {[4, 5, 6].map(val => (
                        <button 
                          key={val}
                          onClick={() => handleRecordBall(val)}
                          disabled={actionLoading}
                          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/15 border border-accent/40 hover:bg-accent hover:text-base font-score font-black text-lg flex items-center justify-center transition-all mx-auto"
                        >
                          {val}
                        </button>
                      ))}
                      <button 
                        onClick={() => {
                          const custom = prompt('Enter custom runs scored:');
                          if (custom && !isNaN(custom)) {
                            handleRecordBall(Number(custom));
                          }
                        }}
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-muted border border-border hover:border-accent font-score font-black text-lg flex items-center justify-center transition-all mx-auto"
                      >
                        ...
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* BADMINTON & TT SETS PANEL */}
        {(match.sport === 'Badminton' || match.sport === 'TT') && (
          <div className="bg-card border border-border/85 p-6 rounded-md shadow-xl mb-8 space-y-6">
            <h2 className="font-display font-black text-sm uppercase text-text-bright tracking-wider border-b border-border/50 pb-4">
              Sets Scoring Actions
            </h2>
            <div className="bg-[#0E0E12] p-5 rounded border border-border/40">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block text-center mb-3">SETS BREAKDOWN</span>
              <div className="flex justify-center items-center gap-4">
                {(match.detail?.sets || []).map((set, idx) => (
                  <div key={idx} className="bg-card border border-border/70 px-4 py-2 rounded text-center">
                    <span className="text-[9px] text-text-muted uppercase block font-bold">SET {idx + 1}</span>
                    <span className="font-score text-sm font-bold text-text-bright block mt-1">
                      {set.scoreA} – {set.scoreB}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => scoreSets('A')} 
                disabled={actionLoading}
                className="flex-1 py-4 bg-muted hover:bg-muted/80 border border-border hover:border-accent text-xs font-display font-bold uppercase tracking-wider text-text-bright rounded transition-all"
              >
                +1 Pt to {match.teamA?.name}
              </button>
              <button 
                onClick={() => scoreSets('B')} 
                disabled={actionLoading}
                className="flex-1 py-4 bg-muted hover:bg-muted/80 border border-border hover:border-accent text-xs font-display font-bold uppercase tracking-wider text-text-bright rounded transition-all"
              >
                +1 Pt to {match.teamB?.name}
              </button>
            </div>
          </div>
        )}

        {/* CHESS, CARROM, BGMI PANEL */}
        {(match.sport === 'Chess' || match.sport === 'Carrom' || match.sport === 'BGMI') && (
          <div className="bg-card border border-border/85 p-6 rounded-md shadow-xl mb-8 space-y-6">
            <h2 className="font-display font-black text-sm uppercase text-text-bright tracking-wider border-b border-border/50 pb-4">
              Points Scoring Actions
            </h2>
            <div className="flex gap-4">
              <div className="flex-1 bg-base/40 border border-border/40 p-4 rounded text-center">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">{match.teamA?.name} Score</span>
                <div className="flex justify-center gap-2 mt-3">
                  <button onClick={() => incrementScore('A', -1)} disabled={actionLoading} className="w-10 h-10 bg-muted hover:bg-muted/80 text-text-bright rounded font-bold">-</button>
                  <button onClick={() => incrementScore('A', 1)} disabled={actionLoading} className="w-10 h-10 bg-accent text-base rounded font-bold">+</button>
                </div>
              </div>
              <div className="flex-1 bg-base/40 border border-border/40 p-4 rounded text-center">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">{match.teamB?.name} Score</span>
                <div className="flex justify-center gap-2 mt-3">
                  <button onClick={() => incrementScore('B', -1)} disabled={actionLoading} className="w-10 h-10 bg-muted hover:bg-muted/80 text-text-bright rounded font-bold">-</button>
                  <button onClick={() => incrementScore('B', 1)} disabled={actionLoading} className="w-10 h-10 bg-accent text-base rounded font-bold">+</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Scorecard Preview (Cricket Only) */}
        {match.sport === 'Cricket' && (
          <div className="mb-8">
            <h2 className="font-display font-black text-sm uppercase text-text-bright tracking-wider mb-4">
              Detailed Scorecard Preview
            </h2>
            <CricketScorecard match={match} />
          </div>
        )}

        {/* DECISION / COMPLETION PANEL */}
        <div className="bg-card border border-border/80 p-6 rounded-md shadow-xl text-center">
          <h3 className="font-display font-black text-sm uppercase text-text-bright tracking-wider border-b border-border/50 pb-4 mb-6">
            Conclude & Seal Match Result
          </h3>
          
          <p className="text-xs text-text-muted mb-6 leading-relaxed">
            Sealing the match results will close the live scorekeeper banner, set the match status to Completed, and dynamically recalculate placement points and team rankings.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => handleCompleteMatch(match.teamA?._id)} 
              disabled={actionLoading}
              className="py-3 px-6 bg-accent text-base hover:bg-accent/90 text-xs font-display font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-40"
            >
              👑 {match.teamA?.name} Won
            </button>
            <button 
              onClick={() => handleCompleteMatch(match.teamB?._id)} 
              disabled={actionLoading}
              className="py-3 px-6 bg-accent text-base hover:bg-accent/90 text-xs font-display font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-40"
            >
              👑 {match.teamB?.name} Won
            </button>
          </div>
        </div>

        {/* Datalists for player autocompletion */}
        <datalist id="available-batters">
          {(inn === 'A' ? match.teamA?.players || [] : match.teamB?.players || []).map(name => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <datalist id="available-bowlers">
          {(inn === 'A' ? match.teamB?.players || [] : match.teamA?.players || []).map(name => (
            <option key={name} value={name} />
          ))}
        </datalist>

      </div>
    </div>
  );
};

export default ScoringConsole;
