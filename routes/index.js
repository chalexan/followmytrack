const express = require('express');

const router = express.Router();
const app = express();

function protect(req, res, next) {
  if (!req.session.username) res.redirect('users/login');
  next();
}

router.get('/', protect, async (req, res) => {
  console.log(req.session.username);
  res.render('index');
});

module.exports = router;
