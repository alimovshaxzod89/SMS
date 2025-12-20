const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema);