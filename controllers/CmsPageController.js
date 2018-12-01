/* var express = require('express');
var router = express.Router(); */

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router(); 
var CmsPage = require("../models/AdminCmsPage"); 

router.post('/list', passport.authenticate('jwt', { session: false}),  cmsPageIndex); 
router.post('/save',passport.authenticate('jwt', { session: false}),saveCmsPage);   

module.exports = router;
 
function cmsPageIndex(req, res){
  var token = getToken(req.headers);
  if (token) {  
    CmsPage.find({
      is_deleted: 0 
    },function (err, posts) {  
      if (err) return next(err); 
      res.json(posts); 
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function saveCmsPage(req, res,next){  
  var token = getToken(req.headers); 
  if (token) { 
    /* var post = new CmsPage(); 
    post.title = { // defines all languages in one call using an object
      en: 'Title on default language',
      ru: 'Another German title',
      uz: 'French title'
    };
    post.description = { // defines all languages in one call using an object
      en: 'Title on default language',
      ru: 'Another German title',
      uz: 'French title'
    };
    post.slug = 'terms';  */

    var newData = new CmsPage({
      name : req.body.name,
      title : req.body.title,
      description: req.body.body,
      slug: req.body.title.en.toLowerCase().replace(/ /g, "_")
    });
    newData.save()
      .then(() =>  res.json({success: true, msg: 'Cms page added successfully..'}))
      .catch(err => 
          next(err)
        ); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }  
}
 