const express = require('express');
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
  const tracks = await Track.find().sort({ createdAt: -1 });
  res.render('personal', { login: req.session.username, id: req.session.uid, tracks });
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
