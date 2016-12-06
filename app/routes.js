// require express
var express = require('express');
var path    = require('path');

// create our router object
var router = express.Router();

// export router
module.exports = router;

// route for our homepage
router.get('/', function(req, res) {
  res.render('pages/home');
});
// route for our about page
router.get('/admin', function(req, res) {
  
  res.render('pages/admin');
});

router.get('/staff-member', function(req, res) {
  res.render('pages/staff');
});