/* var express = require('express');
var router = express.Router(); */

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/User");
var AdminUser = require("../models/AdminUser");
var Book = require("../models/Book");
var Usercontroller = require("../controllers/Usercontroller");
var CarModelController = require("../controllers/CarModelController");
var LanguageController = require("../controllers/LanguageController");
var OfferController = require("../controllers/OfferController");
var CmsPageController = require("../controllers/CmsPageController");
var TextSettingController = require("../controllers/TextSettingController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Express RESTful API');
});

/* users routing */
router.use('/user',Usercontroller); 
router.use('/car-model',CarModelController); 
router.use('/language',LanguageController); 
router.use('/offer',OfferController); 
router.use('/cms-pages',CmsPageController); 
router.use('/text-setting',TextSettingController); 
/* users routing */

router.post('/signup', function(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({success: false, msg: 'Please pass username and password.'});
  } else {
    var newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});
 
router.get('/user-data/:id', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  var user_id = req.param('id');
  if (token) {
    AdminUser.find({
      _id:user_id
    },function (err, data) {
      if (err) return next(err);
      res.json(data);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/signin', function(req, res) {
  User.findOne({
    username: req.body.username,
    user_role_id: 1
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret); 
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token,user:user});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.post('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    console.log(req.body);
    var newBook = new Book({
      isbn: req.body.isbn,
      title: req.body.title,
      author: req.body.author,
      publisher: req.body.publisher
    });

    newBook.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Save book failed.'});
      }
      res.json({success: true, msg: 'Successful created new book.'});
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/book', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Book.find(function (err, books) {
      if (err) return next(err);
      res.json(books);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;

