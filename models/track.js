const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  userid: String,
  trackname: String,
  trackdescription: String,
  start: String,
  s_Lon: Number,
  s_Lat: Number,
  end: String,
  distance: String,
  time: String,
});

module.exports = mongoose.model('Track', trackSchema);
