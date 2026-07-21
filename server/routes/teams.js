const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET /api/teams - Public
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({});
    return res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/teams - Admin Only
router.post('/', verifyAdmin, async (req, res) => {
  const { name, hostelBlock, color, emoji, logo, players, group, nrr } = req.body;
  
  if (!name || !hostelBlock || !color) {
    return res.status(400).json({ message: 'Missing required team fields' });
  }

  try {
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'A team with this name already exists' });
    }

    const team = new Team({ name, hostelBlock, color, emoji, logo, players, group, nrr });
    await team.save();
    return res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /api/teams/:id - Admin Only
router.put('/:id', verifyAdmin, async (req, res) => {
  const { name, hostelBlock, color, emoji, logo, players, group, nrr } = req.body;

  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (name) team.name = name;
    if (hostelBlock) team.hostelBlock = hostelBlock;
    if (color) team.color = color;
    if (emoji !== undefined) team.emoji = emoji;
    if (logo !== undefined) team.logo = logo;
    if (players !== undefined) team.players = players;
    if (group !== undefined) team.group = group;
    if (nrr !== undefined) team.nrr = nrr;

    await team.save();
    return res.status(200).json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/teams/:id - Admin Only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Optional: check if team is linked in matches, but let's just delete it for simplicity
    await Team.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Error deleting team:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
