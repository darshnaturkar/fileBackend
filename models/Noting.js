const mongoose = require('mongoose');

const NotingSchema = new mongoose.Schema({
    file: { type: mongoose.Schema.Types.ObjectId, ref: "file" },
    subject: { type: String, required: true },
    iniBy: { type: String, required: true },
    iniOn: { type: String, required: true },
    appBy: { type: String, required: true },
    appOn: { type: String, required: true },
}, { timestamps:ture});

module.exports = mongoose.model('Noting', NotingSchema);