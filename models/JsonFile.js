const mongoose = require('mongoose');

const JsonFileSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true
  }
});

// module.exports = mongoose.model('JsonFile', JsonFileSchema);



  