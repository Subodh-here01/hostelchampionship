import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import { getMatches, createMatch, updateMatch, deleteMatch } from '../api/matches';
import { getTeams } from '../api/teams';
import { getVenues, createVenue, updateVenue, deleteVenue } from '../api/venues';

const SPORTS = ['Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI'];
const STATUSES = ['Upcoming', 'Live', 'Completed'];

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null); // null when adding

  // Form State
  const [sport, setSport] = useState('Cricket');
  const [category, setCategory] = useState('N/A');
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [status, setStatus] = useState('Upcoming');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [winner, setWinner] = useState(''); // ObjectId or 'draw' or ''
  const [selectedPlayersA, setSelectedPlayersA] = useState([]);
  const [selectedPlayersB, setSelectedPlayersB] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [matchesRes, teamsRes, venuesRes] = await Promise.all([
        getMatches(),
        getTeams(),
        getVenues()
      ]);
      setMatches(matchesRes.data || []);
      const sortedTeams = (teamsRes.data || []).sort((a, b) => a.name.localeCompare(b.name));
      setTeams(sortedTeams);
      setVenues(venuesRes.data || []);
      
      // Seed default selections
      if (sortedTeams.length >= 2) {
        setTeamA(sortedTeams[0]._id);
        setTeamB(sortedTeams[1]._id);
      }
    } catch (err) {
      console.error('Error fetching admin match listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const openAddModal = () => {
    setEditingMatch(null);
    setSport('Cricket');
    setCategory('N/A');
    if (teams.length >= 2) {
      setTeamA(teams[0]._id);
      setTeamB(teams[1]._id);
    } else {
      setTeamA('');
      setTeamB('');
    }
    setScoreA(0);
    setScoreB(0);
    setDate('');
    setVenue('');
    setStatus('Upcoming');
    setYoutubeUrl('');
    setWinner('');
    setSelectedPlayersA([]);
    setSelectedPlayersB([]);
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (match) => {
    setEditingMatch(match);
    setSport(match.sport);
    setCategory(match.category || 'N/A');
    setTeamA(match.teamA?._id || '');
    setTeamB(match.teamB?._id || '');
    setScoreA(match.scoreA || 0);
    setScoreB(match.scoreB || 0);
    
    // Format date string for input type="datetime-local"
    if (match.date) {
      const d = new Date(match.date);
      // Adjust timezone offset to match local string ISO format
      const tzoffset = d.getTimezoneOffset() * 60000; //offset in milliseconds
      const localISOTime = (new Date(d - tzoffset)).toISOString().slice(0, -1);
      setDate(localISOTime.substring(0, 16)); // slice to YYYY-MM-DDTHH:MM
    } else {
      setDate('');
    }
    
    setVenue(match.venue || '');
    setStatus(match.status || 'Upcoming');
    setYoutubeUrl(match.youtubeUrl || '');
    setWinner(match.winner?._id || '');
    setSelectedPlayersA(match.detail?.playersA || []);
    setSelectedPlayersB(match.detail?.playersB || []);
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setActionLoading(true);

    if (teamA === teamB) {
      setErrorMsg('Error: A team cannot compete against itself.');
      setActionLoading(false);
      return;
    }

    if (!date || !venue) {
      setErrorMsg('Please specify both match date/time and venue.');
      setActionLoading(false);
      return;
    }

    // Validate Match Squads count
    let reqCount = 0;
    let label = '';
    const isDoubles = category === 'Doubles';

    if (sport === 'Cricket') {
      reqCount = 13;
      label = 'Cricket requires exactly 13 players';
    } else if (sport === 'BGMI') {
      reqCount = 4;
      label = 'BGMI requires exactly 4 players';
    } else if (['TT', 'Badminton', 'Carrom'].includes(sport)) {
      reqCount = isDoubles ? 2 : 1;
      label = `${sport} ${category} requires exactly ${reqCount} player(s)`;
    } else if (sport === 'Chess') {
      reqCount = 1;
      label = 'Chess requires exactly 1 player';
    }

    if (selectedPlayersA.length !== reqCount) {
      setErrorMsg(`Error for Team A: ${label}. Currently selected: ${selectedPlayersA.length}`);
      setActionLoading(false);
      return;
    }
    if (selectedPlayersB.length !== reqCount) {
      setErrorMsg(`Error for Team B: ${label}. Currently selected: ${selectedPlayersB.length}`);
      setActionLoading(false);
      return;
    }

    const payload = {
      sport,
      category: ['TT', 'Badminton', 'Carrom'].includes(sport) ? category : 'N/A',
      teamA,
      teamB,
      scoreA: Number(scoreA),
      scoreB: Number(scoreB),
      date: new Date(date).toISOString(),
      venue,
      status: editingMatch ? status : 'Upcoming', // Enforce 'Upcoming' status for new matches
      youtubeUrl,
      winner: winner || null,
      detail: {
        ...(editingMatch?.detail || {}),
        playersA: selectedPlayersA,
        playersB: selectedPlayersB
      }
    };

    try {
      if (editingMatch) {
        // Edit existing match
        await updateMatch(editingMatch._id, payload);
      } else {
        // Create new match
        await createMatch(payload);
      }
      setModalOpen(false);
      fetchAllData();
    } catch (err) {
      console.error('Error submitting match form:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to complete database operation.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete this match?')) return;
    
    try {
      await deleteMatch(id);
      fetchAllData();
    } catch (err) {
      console.error('Error deleting match:', err);
      alert('Delete operation failed.');
    }
  };

  const handleAddVenue = async () => {
    const vName = window.prompt("Enter new venue name:");
    if (!vName || !vName.trim()) return;

    try {
      const res = await createVenue({ name: vName.trim() });
      const newVenue = res.data;
      setVenues((prev) => [...prev, newVenue].sort((a, b) => a.name.localeCompare(b.name)));
      setVenue(newVenue.name);
    } catch (err) {
      console.error("Error creating venue:", err);
      alert(err.response?.data?.message || "Failed to create venue.");
    }
  };

  const handleEditVenue = async () => {
    if (!venue) {
      alert("Please select a venue to edit.");
      return;
    }
    const venueObj = venues.find(v => v.name === venue);
    if (!venueObj) return;

    const newName = window.prompt(`Edit venue name:`, venueObj.name);
    if (!newName || !newName.trim() || newName.trim() === venueObj.name) return;

    try {
      const res = await updateVenue(venueObj._id, { name: newName.trim() });
      const updated = res.data;
      setVenues(prev => prev.map(v => v._id === updated._id ? updated : v).sort((a, b) => a.name.localeCompare(b.name)));
      setVenue(updated.name);
    } catch (err) {
      console.error("Error updating venue:", err);
      alert(err.response?.data?.message || "Failed to update venue.");
    }
  };

  const handleDeleteVenue = async () => {
    if (!venue) {
      alert("Please select a venue to delete.");
      return;
    }
    const venueObj = venues.find(v => v.name === venue);
    if (!venueObj) return;

    if (!window.confirm(`Are you sure you want to delete venue "${venueObj.name}"?`)) return;

    try {
      await deleteVenue(venueObj._id);
      setVenues(prev => prev.filter(v => v._id !== venueObj._id));
      setVenue('');
    } catch (err) {
      console.error("Error deleting venue:", err);
      alert(err.response?.data?.message || "Failed to delete venue.");
    }
  };

  const renderMatchScore = (match) => {
    if (match.sport === 'Cricket') {
      const detail = match.detail || {};
      const wA = detail.wicketsA !== undefined ? detail.wicketsA : 0;
      const wB = detail.wicketsB !== undefined ? detail.wicketsB : 0;
      return `${match.scoreA}/${wA} – ${match.scoreB}/${wB}`;
    }
    return `${match.scoreA} – ${match.scoreB}`;
  };

  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="font-display font-bold uppercase tracking-widest text-accent text-sm">
              DATABASE CONSOLES
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-text-bright tracking-wide mt-1">
              Manage <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">Championship Matches</span>
            </h1>
          </div>
          <button
            onClick={openAddModal}
            className="bg-accent hover:bg-accent/90 text-base font-display uppercase font-bold text-xs tracking-wider px-5 py-2.5 rounded shadow-lg shadow-accent/20 transition-all duration-200"
          >
            <i className="fa-solid fa-plus mr-1.5"></i> Add New Match
          </button>
        </div>

        <AdminHeader />

        {/* Matches table */}
        {loading ? (
          <div className="py-24 flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-display uppercase tracking-widest text-accent text-sm">Fetching Fixtures Schedule...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-card border border-border/85 text-center py-20 rounded-md">
            <i className="fa-solid fa-calendar-xmark text-text-muted text-4xl mb-4"></i>
            <p className="font-display uppercase tracking-wider text-text-muted text-sm font-semibold">No matches scheduled in database</p>
          </div>
        ) : (
          <div className="bg-card border border-border/80 rounded overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0E0E12] border-b border-border/50 text-text-muted text-xs uppercase tracking-wider font-display font-bold">
                    <th className="py-4 px-5">Sport</th>
                    <th className="py-4 px-5">Opponents</th>
                    <th className="py-4 px-5 text-center">Score</th>
                    <th className="py-4 px-5">Venue & Date</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 text-sm">
                  {matches.map((m) => (
                    <tr key={m._id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-accent">{m.sport}</td>
                      <td className="py-3.5 px-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-text-bright">{m.teamA?.name || 'TBD'}</span>
                          <span className="text-[10px] text-text-muted">vs</span>
                          <span className="font-semibold text-text-bright">{m.teamB?.name || 'TBD'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-center bg-black/10 font-score font-bold text-accent text-sm">
                        {renderMatchScore(m)}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-text-muted">
                        <div className="flex flex-col">
                          <span className="text-text-bright font-semibold">{m.venue}</span>
                          <span>{new Date(m.date).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-display uppercase tracking-wider border ${
                          m.status === 'Live' ? 'bg-accent-red/10 border-accent-red/35 text-accent-red animate-pulse' :
                          m.status === 'Completed' ? 'bg-accent-green/10 border-accent-green/30 text-accent-green' :
                          'bg-muted border-border/50 text-text-muted'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex justify-end gap-2.5">
                          <Link
                            to={`/admin/scoring/${m._id}`}
                            className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${
                              m.status === 'Live'
                                ? 'bg-red-600/10 border-red-500/40 text-red-500 hover:bg-red-600 hover:text-text-bright hover:border-red-600 animate-pulse'
                                : 'bg-muted border-border text-text-muted hover:border-accent hover:text-accent'
                            }`}
                            title="Live Scoring Console"
                          >
                            <i className="fa-solid fa-gamepad text-xs"></i>
                          </Link>
                          <button
                            onClick={() => openEditModal(m)}
                            className="w-8 h-8 rounded bg-muted border border-border text-text-bright hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
                            title="Edit Match"
                          >
                            <i className="fa-solid fa-pen-to-square text-xs"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteMatch(m._id)}
                            className="w-8 h-8 rounded bg-muted border border-border text-accent-red hover:bg-accent-red/10 hover:border-accent-red flex items-center justify-center transition-colors"
                            title="Delete Match"
                          >
                            <i className="fa-solid fa-trash-can text-xs"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1500] p-4">
            <div className="bg-card border border-border/80 rounded w-full max-w-xl shadow-2xl overflow-hidden glow-gold-left max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="bg-[#0E0E12] border-b border-border/50 px-6 py-4 flex justify-between items-center">
                <h3 className="font-display font-black uppercase text-lg text-text-bright">
                  {editingMatch ? 'Modify Match parameters' : 'Schedule New Match'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-text-bright transition-colors text-lg">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4">
                
                {errorMsg && (
                  <div className="bg-accent-red/10 border border-accent-red/30 text-accent-red text-xs py-2 px-3 rounded flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation"></i>
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Sport */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Sport</label>
                    <select
                      value={sport}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSport(val);
                        if (!['TT', 'Badminton', 'Carrom'].includes(val)) {
                          setCategory('N/A');
                        } else {
                          setCategory('Singles');
                        }
                      }}
                      className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                    >
                      {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  {/* Category (Singles/Doubles) - TT/Badminton/Carrom */}
                  {['TT', 'Badminton', 'Carrom'].includes(sport) ? (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                      >
                        <option value="Singles">Singles</option>
                        <option value="Doubles">Doubles</option>
                      </select>
                    </div>
                  ) : (
                    editingMatch ? (
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Status</label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    ) : null
                  )}

                  {/* Status placed below if category is visible and editing */}
                  {['TT', 'Badminton', 'Carrom'].includes(sport) && editingMatch && (
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent w-full"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}

                  {/* Team A Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Opponent Team A</label>
                    <select
                      value={teamA}
                      onChange={(e) => {
                        setTeamA(e.target.value);
                        setSelectedPlayersA([]);
                      }}
                      className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                    >
                      {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>

                  {/* Team B Selection */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Opponent Team B</label>
                    <select
                      value={teamB}
                      onChange={(e) => {
                        setTeamB(e.target.value);
                        setSelectedPlayersB([]);
                      }}
                      className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                    >
                      {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>

                  {/* Players Team A Checkbox list */}
                  <div className="flex flex-col gap-1 col-span-2 bg-[#0E0E12]/80 border border-border/40 rounded p-3">
                    <span className="text-[10px] text-accent uppercase font-bold tracking-wider mb-2">
                      Select Team A Squad ({selectedPlayersA.length} Selected)
                    </span>
                    <div className="grid grid-cols-3 gap-2 max-h-[120px] overflow-y-auto pr-1">
                      {(teams.find(t => t._id === teamA)?.players || []).map(p => {
                        const isChecked = selectedPlayersA.includes(p);
                        return (
                          <label key={p} className="flex items-center gap-1.5 text-xs text-text-bright cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedPlayersA(prev => prev.filter(x => x !== p));
                                } else {
                                  setSelectedPlayersA(prev => [...prev, p]);
                                }
                              }}
                              className="accent-accent animate-none"
                            />
                            <span className="truncate">{p}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Players Team B Checkbox list */}
                  <div className="flex flex-col gap-1 col-span-2 bg-[#0E0E12]/80 border border-border/40 rounded p-3">
                    <span className="text-[10px] text-accent uppercase font-bold tracking-wider mb-2">
                      Select Team B Squad ({selectedPlayersB.length} Selected)
                    </span>
                    <div className="grid grid-cols-3 gap-2 max-h-[120px] overflow-y-auto pr-1">
                      {(teams.find(t => t._id === teamB)?.players || []).map(p => {
                        const isChecked = selectedPlayersB.includes(p);
                        return (
                          <label key={p} className="flex items-center gap-1.5 text-xs text-text-bright cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedPlayersB(prev => prev.filter(x => x !== p));
                                } else {
                                  setSelectedPlayersB(prev => [...prev, p]);
                                }
                              }}
                              className="accent-accent animate-none"
                            />
                            <span className="truncate">{p}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Score A */}
                  {editingMatch && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Team A Score</label>
                      <input
                        type="number"
                        value={scoreA}
                        onChange={(e) => setScoreA(e.target.value)}
                        min="0"
                        className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>
                  )}

                  {/* Score B */}
                  {editingMatch && (
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Team B Score</label>
                      <input
                        type="number"
                        value={scoreB}
                        onChange={(e) => setScoreB(e.target.value)}
                        min="0"
                        className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                      />
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  {/* Venue */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Venue</label>
                    <div className="flex gap-2">
                      <select
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent w-full"
                        required
                      >
                        <option value="">-- Select Venue --</option>
                        {venues.map(v => (
                          <option key={v._id} value={v.name}>{v.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddVenue}
                        className="bg-accent hover:bg-accent/90 text-base font-bold text-xs tracking-wider px-3 rounded flex items-center justify-center transition-colors"
                        title="Add Venue"
                      >
                        +
                      </button>
                      {venue && (
                        <>
                          <button
                            type="button"
                            onClick={handleEditVenue}
                            className="bg-[#E8C547] hover:bg-[#E8C547]/90 text-base font-bold text-xs tracking-wider px-3 rounded flex items-center justify-center transition-colors"
                            title="Edit Selected Venue"
                          >
                            <i className="fa-solid fa-pen text-[10px]"></i>
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteVenue}
                            className="bg-[#E84747] hover:bg-[#E84747]/90 text-base font-bold text-xs tracking-wider px-3 rounded flex items-center justify-center transition-colors"
                            title="Delete Selected Venue"
                          >
                            <i className="fa-solid fa-trash-can text-[10px]"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>

                {/* Youtube URL */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Stream / Replay Link (YouTube URL)</label>
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Winner (Only unlocked/relevant on Completed status) */}
                {status === 'Completed' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Assigned Winner</label>
                    <select
                      value={winner}
                      onChange={(e) => setWinner(e.target.value)}
                      className="w-full bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                    >
                      <option value="">No winner selected</option>
                      {teams.filter(t => t._id === teamA || t._id === teamB).map(t => (
                        <option key={t._id} value={t._id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Submit buttons */}
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-border text-text-bright rounded hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-accent text-base rounded hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                  >
                    {actionLoading && <span className="w-3.5 h-3.5 border-2 border-base border-t-transparent rounded-full animate-spin"></span>}
                    {editingMatch ? 'Save Changes' : 'Schedule Match'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminMatches;
