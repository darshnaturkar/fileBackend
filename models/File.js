const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true  },
  number: { type: String, required: true, unique: true },
  noting: { type: String, required: true },
  sheet: { type: String, required: true },
  supportFile: { type: String, required: true },
  isActive: {type: Boolean, default: true}
},{timestamps: true});

module.exports = mongoose.model('File', FileSchema);