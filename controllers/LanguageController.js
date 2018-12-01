var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router(); 
var AdminLanguage = require("../models/AdminLanguage"); 

router.post('/list', passport.authenticate('jwt', { session: false}),  languageIndex); 
router.post('/save',passport.authenticate('jwt', { session: false}),saveLanguage);  
router.get('/delete/:id', passport.authenticate('jwt', { session: false}),  deleteLanguage); 
router.get('/edit/:id', passport.authenticate('jwt', { session: false}),  editLanguage); 
router.post('/update/:id', passport.authenticate('jwt', { session: false}),  updateLanguage); 
router.get('/status/:id/:status', passport.authenticate('jwt', { session: false}),updateLanguageStatus);

module.exports = router;

function languageIndex(req, res){
  var token = getToken(req.headers);
  if (token) {
    if(!req.body.page) req.body.page = 1;
    if(!req.body.name) req.body.name = '';
    AdminLanguage.paginate({
      is_deleted: 0,
      name:{ $regex: '.*' + req.body.name + '.*' }
    },{page:req.body.page, limit: global.ADMIN_PER_PAGE_RECORD },function (err, data) {
      if (err) return next(err); 
      res.json(data); 
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function saveLanguage(req, res,next){  
  var token = getToken(req.headers); 
  if (token) { 
    var newData = new AdminLanguage({
      name: req.body.name,
      lang_code: req.body.lang_code
    }); 

    newData.save()
      .then(() =>  res.json({success: true, msg: 'Language added successfully..'}))
      .catch(err => 
          next(err)
        ); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }  
}

function editLanguage(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminLanguage.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      res.json(data); 
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function updateLanguage(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminLanguage.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.name     = req.body.name;
      data.lang_code = req.body.lang_code;
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Language updated successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function deleteLanguage(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminLanguage.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.is_deleted = 1;
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Language deleted successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function updateLanguageStatus(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id && req.params.status) { 
    AdminLanguage.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.is_active = req.params.status;
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Status updated successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
} 
