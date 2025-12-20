const mongoose = require('mongoose');

const TokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['teacher', 'student', 'parent', 'admin']
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index - token expire bo'lganda avtomatik o'chiriladi
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TokenBlacklist', TokenBlacklistSchema);