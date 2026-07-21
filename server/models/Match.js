const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
    enum: ['Cricket', 'TT', 'Badminton', 'Chess', 'Carrom', 'BGMI']
  },
  category: {
    type: String,
    enum: ['Singles', 'Doubles', 'N/A'],
    default: 'N/A'
  },
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  scoreA: {
    type: Number,
    default: 0
  },
  scoreB: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Upcoming', 'Live', 'Completed'],
    default: 'Upcoming'
  },
  youtubeUrl: {
    type: String,
    default: ''
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  detail: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  history: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  }
});

module.exports = mongoose.model('Match', matchSchema);
