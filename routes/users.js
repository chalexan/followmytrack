const express = require('express');
const sha256 = require('sha256');
const User = require('../models/user');

const router = express.Router();
const app = express();

router.get('/login', (req, res) => {
  res.render('login', { login: req.session.username });
});

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login, password: sha256(password) });
  if (user) {
    req.session.username = login;
    req.session.uid = user._id;
  }
  res.redirect('/');
});

router.get('/register', (req, res) => {
  res.render('register', { login: req.session.username });
});

router.post('/register', async (req, res) => {
  const { login, password } = req.body;
  const passwordHashed = sha256(password);
  await User.create({ login, password: passwordHashed });
  const id = await User.findOne({ login, password: passwordHashed });
  req.session.username = login;
  req.session.uid = id._id;
  res.redirect('/');
});

router.get('/exit', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
