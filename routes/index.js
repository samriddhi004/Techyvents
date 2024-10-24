var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Techyvents' });
});

router.get('/create-event', function(req, res, next) {
  res.render('createEvent');
});

module.exports = router;
