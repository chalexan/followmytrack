const express = require('express');

const router = express.Router();
const app = express();

function protect(req, res, next) {
  if (!req.session.username) res.redirect('users/login');
  next();
}

router.get('/', protect, async (req, res) => {
  res.render('index', { login: req.session.username });
});

module.exports = router;
