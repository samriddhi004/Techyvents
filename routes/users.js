var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});



//login signup



router.get('/login', function(req, res) {
  res.render('login');
});

// GET signup page
router.get('/signup', function(req, res) {
  res.render('signup');
});

// POST login
router.post('/login', function(req, res) {
  const { username, password } = req.body;
  // Implement your authentication logic here
  // For example, check the username and password against a database
  res.send(`Welcome back, ${username}!`);
});

// POST signup
router.post('/signup', function(req, res) {
  const { username, password } = req.body;
  // Implement your sign-up logic here
  // For example, save the user to a database
  res.send(`User ${username} signed up successfully!`);
});


module.exports = router;
