const express = require('express');
const router = express.Router();
const Venue = require('../models/Venue');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET /api/venues - Public
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find({}).sort({ name: 1 });
    return res.status(200).json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/venues - Admin Only
router.post('/', verifyAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Venue name is required' });
  }

  try {
    const existing = await Venue.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'A venue with this name already exists' });
    }

    const venue = new Venue({ name });
    await venue.save();
    return res.status(201).json(venue);
  } catch (error) {
    console.error('Error creating venue:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /api/venues/:id - Admin Only
router.put('/:id', verifyAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Venue name is required' });
  }

  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Check if name is already taken by another venue
    const existing = await Venue.findOne({ name, _id: { $ne: req.params.id } });
    if (existing) {
      return res.status(400).json({ message: 'A venue with this name already exists' });
    }

    venue.name = name;
    await venue.save();
    return res.status(200).json(venue);
  } catch (error) {
    console.error('Error updating venue:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/venues/:id - Admin Only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    await Venue.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Venue deleted successfully' });
  } catch (error) {
    console.error('Error deleting venue:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
