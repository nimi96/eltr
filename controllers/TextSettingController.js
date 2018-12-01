/* var express = require('express');
var router = express.Router(); */

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router(); 
var AdminLanguageSetting = require("../models/AdminLanguageSetting"); 
var fs			= require('fs');

router.post('/list', passport.authenticate('jwt', { session: false}),  cmsPageIndex); 
router.post('/save',passport.authenticate('jwt', { session: false}),saveCmsPage);   

module.exports = router;
 
function cmsPageIndex(req, res){
  var token = getToken(req.headers);
  if (token) {  
    CmsPage.findOne({
      is_deleted: 0 
    },function (err, posts) {
      CmsPage.setDefaultLanguage('uz');
      if (err) return next(err);  
      console.log(posts.title)
      console.log(posts.body)
      res.json(posts); 
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function saveCmsPage(req, res,next){  
  var token = getToken(req.headers); 
  if (token) { 
    var p = req.body.title;   
    
    for (var key in p) {
        if (p.hasOwnProperty(key)) {
          var textSetting = new AdminLanguageSetting(); 
          textSetting.key_value = req.body.name;  
          textSetting.lang_code = key;  
          textSetting.value = p[key];  
      
          textSetting.save() 
            .catch(err => 
                next(err)
              ); 
 
          /* Append Data in file */
          var file_name = 'text_setting.js';
          var new_text  =  '\n global.'+key+'_'+req.body.name+' = "'+p[key]+'";';
          fs.appendFileSync(file_name,new_text, function(err) {
            if(err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }); 
        }
    } 

    res.json({success: true, msg: 'Text added successfully.'})
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }  
}
 