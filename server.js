// require all dependencies
var express        = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser     = require('body-parser');
var firebase = require('firebase');
var admin = require('firebase-admin');

var app            = express();
var port           = process.env.PORT || 8080;


// use ejs and express layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);

// use body parser
app.use(bodyParser.urlencoded({ extended: true }));

// route app
var router = require('./app/routes');
app.use('/', router);

// set static files (css and images, etc) location
app.use(express.static(__dirname + '/public'));


// start the server
app.listen(port, function() {
  console.log('Maintenance Tracked App Started');
});


