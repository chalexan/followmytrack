const express = require('express');

const router = express.Router();
const app = express();

router.get('/login', async (req, res) => {
  res.render('login');
});

module.exports = router;
