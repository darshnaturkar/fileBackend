const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true  },
  number: { type: String, required: true, unique: true },
  noting: { type: String, required: true },
  sheet: { type: String, required: true },
},{timestamps: true});

module.exports = mongoose.model('File', FileSchema);