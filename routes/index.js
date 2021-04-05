const express = require('express');
const write = require('write');
const Track = require('../models/track');
const User = require('../models/user');
const Link = require('../models/links');

const router = express.Router();
const app = express();

function protect(req, res, next) {
  if (!req.session.username) res.redirect('users/login');
  next();
}

function generatePassword() {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

router.get('/', protect, async (req, res) => {
  res.render('index', { login: req.session.username, id: req.session.uid });
});

router.post('/new', async (req, res) => {
  const user = await User.findById(req.body.userid);
  if (user) {
    await Track.create(req.body);
  }
  res.redirect('/personal');
});

router.get('/personal', protect, async (req, res) => {
  const tracks = await Track.find({ userid: req.session.uid }).sort({ createdAt: -1 });
  res.render('personal', { login: req.session.username, id: req.session.uid, tracks });
});

router.get('/share/:id', async (req, res) => {
  const link = generatePassword();
  await Link.create({ trackId: req.params.id, link });
  res.send(`/links/${link}`);
});

router.get('/links/:id', async (req, res) => {
  const rec = await Link.findOne({ link: req.params.id });
  const track = await Track.findById(rec.trackId);
  res.render('tracking', { login: req.session.username, id: req.session.uid, track });
});

router.post('/gpx/:id', async (req, res) => {
  write.sync(`public/gpx/${req.params.id}.gpx`, req.body.gpx);
  res.send(`gpx/${req.params.id}.gpx`);
});

router.get('/delete/:id', async (req, res) => {
  await Track.deleteOne({ _id: req.params.id });
  res.redirect('/personal');
});

router.get('/:id', protect, async (req, res) => {
  const track = await Track.findById(req.params.id);
  res.render('tracking', { login: req.session.username, id: req.session.uid, track });
});

module.exports = router;
