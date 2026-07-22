import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../api/teams';
import { compressImage } from '../utils/imageCompressor';

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null); // null when adding

  // Form State
  const [name, setName] = useState('');
  const [hostelBlock, setHostelBlock] = useState('');
  const [color, setColor] = useState('#FF4D00');
  const [emoji, setEmoji] = useState('🏆');
  const [logo, setLogo] = useState('');
  const [playersText, setPlayersText] = useState('');
  const [group, setGroup] = useState('A');
  const [nrr, setNrr] = useState('0.0');
  const [errorMsg, setErrorMsg] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTeamsData = async () => {
    setLoading(true);
    try {
      const res = await getTeams();
      setTeams(res.data || []);
    } catch (err) {
      console.error('Error fetching admin team listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamsData();
  }, []);

  const openAddModal = () => {
    setEditingTeam(null);
    setName('');
    setHostelBlock('');
    setColor('#FF4D00');
    setEmoji('🏆');
    setLogo('');
    setPlayersText('');
    setGroup('A');
    setNrr('0.0');
    setErrorMsg('');
    setModalOpen(true);
  };

  const openEditModal = (team) => {
    setEditingTeam(team);
    setName(team.name || '');
    setHostelBlock(team.hostelBlock || '');
    setColor(team.color || '#FF4D00');
    setEmoji(team.emoji || '🏆');
    setLogo(team.logo || '');
    setPlayersText(team.players ? team.players.join('\n') : '');
    setGroup(team.group || 'A');
    setNrr(team.nrr !== undefined ? String(team.nrr) : '0.0');
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setActionLoading(true);

    if (!name || !hostelBlock || !color || !emoji) {
      setErrorMsg('All fields (name, block, color, emoji) are required.');
      setActionLoading(false);
      return;
    }

    const playerList = playersText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (playerList.length < 15 || playerList.length > 20) {
      setErrorMsg('Error: A team must have between 15 and 20 players registered.');
      setActionLoading(false);
      return;
    }

    const payload = {
      name,
      hostelBlock,
      color,
      emoji,
      logo,
      players: playerList,
      group,
      nrr: Number(nrr) || 0.0
    };

    try {
      if (editingTeam) {
        await updateTeam(editingTeam._id, payload);
      } else {
        await createTeam(payload);
      }
      setModalOpen(false);
      fetchTeamsData();
    } catch (err) {
      console.error('Error saving team details:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save team registration details.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm('WARNING: Deleting this team might break existing match records referencing it. Are you absolutely sure?')) return;

    try {
      await deleteTeam(id);
      fetchTeamsData();
    } catch (err) {
      console.error('Error deleting team:', err);
      alert('Delete operation failed.');
    }
  };

  return (
    <div className="min-h-screen bg-base pt-[100px] pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <span className="font-display font-bold uppercase tracking-widest text-accent text-sm">
              DATABASE CONSOLES
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-black uppercase text-text-bright tracking-wide mt-1">
              Manage <span className="bg-gradient-to-r from-accent to-accent-red bg-clip-text text-transparent">Hostel Teams</span>
            </h1>
          </div>
          <button
            onClick={openAddModal}
            className="bg-accent hover:bg-accent/90 text-base font-display uppercase font-bold text-xs tracking-wider px-5 py-2.5 rounded shadow-lg shadow-accent/20 transition-all duration-200"
          >
            <i className="fa-solid fa-plus mr-1.5"></i> Register Team
          </button>
        </div>

        <AdminHeader />

        {/* Loading / List Grid */}
        {loading ? (
          <div className="py-24 flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-display uppercase tracking-widest text-accent text-sm">Retrieving registered teams...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-card border border-border/85 text-center py-20 rounded-md">
            <i className="fa-solid fa-shield text-text-muted text-4xl mb-4"></i>
            <p className="font-display uppercase tracking-wider text-text-muted text-sm font-semibold">No teams registered in system</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((t) => (
              <div
                key={t._id}
                className="bg-card border border-border/80 p-5 rounded-md flex justify-between items-center shadow-lg relative glow-gold-left"
              >

                {/* Left details */}
                <div className="flex items-center gap-4">
                  <span
                    className="w-12 h-12 rounded border-2 bg-muted/65 flex items-center justify-center text-2xl shadow-inner select-none overflow-hidden"
                    style={{ borderColor: `${t.color}`, boxShadow: `0 0 12px ${t.color}25` }}
                  >
                    {t.logo ? (
                      <img src={t.logo} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      t.emoji || '🏆'
                    )}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-display uppercase font-bold text-lg text-text-bright leading-tight">{t.name}</span>
                    <span className="text-xs text-text-muted">Hostel Address: <strong className="text-text-bright">{t.hostelBlock}</strong></span>
                    <span className="text-xs text-text-muted">Roster: <strong className="text-text-bright">{t.players ? t.players.length : 0} / 20 Players</strong></span>
                    <span className="text-[10px] text-text-muted flex items-center gap-1.5 mt-0.5">
                      Theme Color:
                      <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: t.color }} title={t.color}></span>
                    </span>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="w-8 h-8 rounded bg-muted border border-border text-text-bright hover:border-accent hover:text-accent flex items-center justify-center transition-colors"
                    title="Edit Team"
                  >
                    <i className="fa-solid fa-pen-to-square text-xs"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteTeam(t._id)}
                    className="w-8 h-8 rounded bg-muted border border-border text-accent-red hover:bg-accent-red/10 hover:border-accent-red flex items-center justify-center transition-colors"
                    title="Delete Team"
                  >
                    <i className="fa-solid fa-trash-can text-xs"></i>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Modal Overlay */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1500] p-4">
            <div className="bg-card border border-border/80 rounded w-full max-w-md shadow-2xl overflow-hidden glow-gold-left">

              {/* Header */}
              <div className="bg-[#0E0E12] border-b border-border/50 px-6 py-4 flex justify-between items-center">
                <h3 className="font-display font-black uppercase text-lg text-text-bright">
                  {editingTeam ? 'Modify Team profile' : 'Register New Team'}
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

                {/* Team Name & Net Run Rate */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Team Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Block A Raptors"
                      className="bg-muted border border-border text-text-bright rounded p-2.5 text-xs focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Net Run Rate (NRR)</label>
                    <input
                      type="text"
                      value={nrr}
                      onChange={(e) => setNrr(e.target.value)}
                      placeholder="e.g. +1.240"
                      className="bg-muted border border-border text-text-bright rounded p-2.5 text-xs focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                </div>

                {/* Hostel Block & Group */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Hostel Block / Wing</label>
                    <input
                      type="text"
                      value={hostelBlock}
                      onChange={(e) => setHostelBlock(e.target.value)}
                      placeholder="e.g. Block H3"
                      className="bg-muted border border-border text-text-bright rounded p-2.5 text-xs focus:outline-none focus:border-accent"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Championship Group</label>
                    <select
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="bg-muted border border-border text-text-bright rounded p-2.5 text-xs focus:outline-none focus:border-accent w-full"
                      required
                    >
                      <option value="A">Group A</option>
                      <option value="B">Group B</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  {/* Emoji */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Identity Emoji</label>
                    <input
                      type="text"
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      placeholder="e.g. 🦖"
                      maxLength="4"
                      className="bg-muted border border-border text-center text-text-bright rounded p-2.5 text-sm focus:outline-none focus:border-accent"
                      required
                    />
                  </div>

                  {/* Hex Color */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Accent Theme Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="bg-muted border border-border text-text-bright rounded p-1 w-12 h-10 cursor-pointer focus:outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="#FF4D00"
                        maxLength="7"
                        className="bg-muted border border-border text-text-bright rounded px-2 text-xs focus:outline-none focus:border-accent w-full"
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Logo File Selector */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Team Logo Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          setErrorMsg('');
                          // Compress logo to max 300x300, quality 0.85
                          const compressedBase64 = await compressImage(file, { maxWidth: 300, maxHeight: 300, quality: 0.85 });
                          setLogo(compressedBase64);
                        } catch (err) {
                          console.error('Logo compression failed:', err);
                          setErrorMsg('Failed to process and compress logo image.');
                        }
                      }
                    }}
                    className="bg-muted border border-border text-text-bright rounded p-2 text-xs focus:outline-none focus:border-accent"
                  />
                  {logo && (
                    <div className="mt-2 relative w-12 h-12 rounded border border-border overflow-hidden bg-muted">
                      <img src={logo} alt="Team Logo Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setLogo('')}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center text-text-bright hover:bg-black/80 text-[9px] transition-colors font-bold"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Players Roster Textarea */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Players Roster (Between 15 and 20 full names, one per line)</label>
                  <span className="text-[9px] text-text-muted -mt-0.5 block mb-1">
                    Please use unique full names (e.g. First Name + Last Name) so they can be searched easily during live scoring.
                  </span>
                  <textarea
                    value={playersText}
                    onChange={(e) => setPlayersText(e.target.value)}
                    placeholder="Maynk Sehray&#10;Shreeraksh&#10;Pratham&#10;Subodh"
                    rows="5"
                    className="bg-muted border border-border text-text-bright rounded p-2.5 text-xs focus:outline-none focus:border-accent resize-none font-mono"
                  ></textarea>
                </div>

                {/* Submit */}
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
                    {editingTeam ? 'Save Changes' : 'Register Team'}
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

export default AdminTeams;
