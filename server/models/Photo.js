const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
    enum: ['Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI']
  },
  imageUrl: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Photo', photoSchema);
