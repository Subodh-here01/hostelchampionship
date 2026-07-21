const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET /api/matches - Public (Supports query parameters ?sport= & ?status=)
router.get('/', async (req, res) => {
  const filter = {};
  
  if (req.query.sport) {
    // Exact match (capitalized on frontend: Cricket, TT, Badminton, Chess, Carrom, BGMI)
    filter.sport = req.query.sport;
  }
  
  if (req.query.status) {
    // Exact match (Upcoming, Live, Completed)
    filter.status = req.query.status;
  }

  try {
    const matches = await Match.find(filter)
      .populate('teamA')
      .populate('teamB')
      .populate('winner')
      .sort({ date: 1, time: 1 });
    return res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/matches/:id - Public
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('teamA')
      .populate('teamB')
      .populate('winner');
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    return res.status(200).json(match);
  } catch (error) {
    console.error('Error fetching single match:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/matches - Admin Only
router.post('/', verifyAdmin, async (req, res) => {
  const { sport, category, teamA, teamB, scoreA, scoreB, date, venue, status, youtubeUrl, winner } = req.body;

  if (!sport || !teamA || !teamB || !date || !venue) {
    return res.status(400).json({ message: 'Missing required match details' });
  }

  try {
    const match = new Match({
      sport,
      category: category || 'N/A',
      teamA,
      teamB,
      scoreA: scoreA || 0,
      scoreB: scoreB || 0,
      date,
      venue,
      status: status || 'Upcoming',
      youtubeUrl: youtubeUrl || '',
      winner: winner || null
    });

    await match.save();
    const populatedMatch = await Match.findById(match._id)
      .populate('teamA')
      .populate('teamB')
      .populate('winner');

    return res.status(201).json(populatedMatch);
  } catch (error) {
    console.error('Error creating match:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /api/matches/:id - Admin Only
router.put('/:id', verifyAdmin, async (req, res) => {
  const { sport, category, teamA, teamB, scoreA, scoreB, date, venue, status, youtubeUrl, winner } = req.body;

  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (sport) match.sport = sport;
    if (category) match.category = category;
    if (teamA) match.teamA = teamA;
    if (teamB) match.teamB = teamB;
    if (scoreA !== undefined) match.scoreA = scoreA;
    if (scoreB !== undefined) match.scoreB = scoreB;
    if (date) match.date = date;
    if (venue) match.venue = venue;
    if (status) match.status = status;
    if (youtubeUrl !== undefined) match.youtubeUrl = youtubeUrl;
    
    // Support clearing the winner by passing null or empty string
    if (winner !== undefined) {
      match.winner = winner === '' || winner === 'draw' ? null : winner;
    }

    await match.save();
    
    const updatedMatch = await Match.findById(match._id)
      .populate('teamA')
      .populate('teamB')
      .populate('winner');

    return res.status(200).json(updatedMatch);
  } catch (error) {
    console.error('Error updating match:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /api/matches/:id/score - Admin Only (Updates score, detail, and pushes previous state to history)
router.put('/:id/score', verifyAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const { scoreA, scoreB, detail } = req.body;

    const historyItem = {
      scoreA: match.scoreA,
      scoreB: match.scoreB,
      detail: match.detail || {},
      timestamp: new Date()
    };

    match.history.push(historyItem);
    if (match.history.length > 20) {
      match.history.shift();
    }

    if (scoreA !== undefined) match.scoreA = scoreA;
    if (scoreB !== undefined) match.scoreB = scoreB;
    if (detail !== undefined) match.detail = detail;

    match.markModified('detail');
    match.markModified('history');

    const saved = await match.save();
    
    // Populate teams to return complete match object
    const populated = await Match.findById(saved._id)
      .populate('teamA')
      .populate('teamB')
      .populate('winner');

    return res.status(200).json(populated);
  } catch (error) {
    console.error('Error updating live match score:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/matches/:id/undo - Admin Only (Pops last state from history and restores it)
router.post('/:id/undo', verifyAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (!match.history || match.history.length === 0) {
      return res.status(400).json({ message: 'No history to undo' });
    }

    const prevState = match.history.pop();
    
    match.scoreA = prevState.scoreA;
    match.scoreB = prevState.scoreB;
    match.detail = prevState.detail;

    match.markModified('detail');
    match.markModified('history');

    const saved = await match.save();

    const populated = await Match.findById(saved._id)
      .populate('teamA')
      .populate('teamB')
      .populate('winner');

    return res.status(200).json(populated);
  } catch (error) {
    console.error('Error performing undo on match:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/matches/:id - Admin Only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    await Match.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    console.error('Error deleting match:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
