const express = require('express');
const write = require('write');
const Track = require('../models/track');
const User = require('../models/user');

const router = express.Router();
const app = express();

function protect(req, res, next) {
  if (!req.session.username) res.redirect('users/login');
  next();
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

router.post('/gpx/:id', async (req, res) => {
  write.sync(`public/gpx/${req.params.id}.gpx`, req.body.gpx);
  res.send(`gpx/${req.params.id}.gpx`);
});

router.get('/delete/:id', async (req, res) => {
  await Track.deleteOne({ _id: req.params.id });
  res.redirect('/personal');
});

router.get('/:id', async (req, res) => {
  const track = await Track.findById(req.params.id);
  res.render('tracking', { login: req.session.username, id: req.session.uid, track });
});

module.exports = router;
