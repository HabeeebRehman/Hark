const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['manager', 'developer', 'admin'],
    default: 'developer'
  },
  managedDevelopers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  skills: {
    type: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'expert'],
        default: 'beginner'
      }
    }],
    default: undefined
  },
  avatar: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
