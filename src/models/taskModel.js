const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['queued', 'completed'],
    default: 'queued',
  },
});

module.exports = mongoose.model('Task', taskSchema);
