

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    fileUrl: { type: String },  // URL to the uploaded file if any
    createdAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Link to the user
  });
  
  module.exports = mongoose.model('report', reportSchema);
