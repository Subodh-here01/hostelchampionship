const express = require('express');
const router = express.Router();
const Photo = require('../models/Photo');
const verifyAdmin = require('../middleware/verifyAdmin');

// GET /api/gallery - Public (Supports query parameters ?sport=)
router.get('/', async (req, res) => {
  const filter = {};
  if (req.query.sport) {
    const formattedSport = req.query.sport.charAt(0).toUpperCase() + req.query.sport.slice(1).toLowerCase();
    filter.sport = formattedSport;
  }

  try {
    const photos = await Photo.find(filter).sort({ uploadedAt: -1 });
    return res.status(200).json(photos);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/gallery - Admin Only
router.post('/', verifyAdmin, async (req, res) => {
  const { sport, imageUrl, caption } = req.body;

  if (!sport || !imageUrl || !caption) {
    return res.status(400).json({ message: 'Missing required gallery details' });
  }

  try {
    const photo = new Photo({
      sport,
      imageUrl,
      caption,
      uploadedAt: new Date()
    });

    await photo.save();
    return res.status(201).json(photo);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/gallery/:id - Admin Only
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    await Photo.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
