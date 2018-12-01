/* var express = require('express');
var router = express.Router(); */

var mongoose = require('mongoose');
var passport = require('passport');  
var express = require('express');
var jwt = require('jsonwebtoken'); 
var router = express.Router(); 
var MobileUsercontroller = require("../webservice/controllers/MobileUsercontroller");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express RESTful MOBILE API');
});

/* users routing */
router.use('/user',MobileUsercontroller) 
/* users routing */

module.exports = router;

