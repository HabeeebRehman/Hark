const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'developer', 'manager'],
      default: 'member'
    }
  }],
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Workspace', WorkspaceSchema);
