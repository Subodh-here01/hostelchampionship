const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  hostelBlock: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    default: '#FF4D00'
  },
  emoji: {
    type: String,
    default: '🏆'
  },
  logo: {
    type: String,
    default: ''
  },
  players: {
    type: [String],
    default: []
  },
  group: {
    type: String,
    enum: ['A', 'B'],
    default: 'A'
  },
  nrr: {
    type: Number,
    default: 0.0
  }
});

module.exports = mongoose.model('Team', teamSchema);
