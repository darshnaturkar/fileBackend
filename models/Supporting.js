const mongoose = require('mongoose');

const SupportingSchema = new mongoose.Schema({
    file: { type: mongoose.Schema.Types.ObjectId, ref: "file" },
    name: { type: String, required: true },
    pageSeq: { type: String, required: true },
    totalPages: { type: String, required: true },
}, {timestamps: true});

module.exports = mongoose.model('Supporting', SupportingSchema);