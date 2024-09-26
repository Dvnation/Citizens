

// models/User.js
const mongoose = require('mongoose');



const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name:{
    type: String,
    
  },
  reports: [
    {
      category: String,
      description: String,
      date: { type: Date, default: Date.now },
      location: String, // Optional, specific location for the report

    },
  ]
});





module.exports = mongoose.model('User', UserSchema);
