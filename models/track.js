const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  userid: String,
  trackname: String,
  trackdescription: String,
  start: String,
  startH: String,
  s_Lon: Number,
  s_Lat: Number,
  end: String,
  endH: String,
  distance: String,
  time: String,
}, { timestamps: true });

module.exports = mongoose.model('Track', trackSchema);
