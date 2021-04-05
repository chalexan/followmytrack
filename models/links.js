const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  trackId: String,
  link: String,
}, { timestamps: true });

module.exports = mongoose.model('Link', linkSchema);
