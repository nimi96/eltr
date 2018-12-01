/* var express = require('express');
var router = express.Router(); */

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router(); 
var AdminCarModel = require("../models/AdminCarModel"); 

router.post('/list', passport.authenticate('jwt', { session: false}),  carModelIndex); 
router.post('/save',passport.authenticate('jwt', { session: false}),saveCarModel);  
router.get('/delete/:id', passport.authenticate('jwt', { session: false}),  deleteCarModel); 
router.get('/edit/:id', passport.authenticate('jwt', { session: false}),  editCarModel); 
router.post('/update/:id', passport.authenticate('jwt', { session: false}),  updateCarModel); 
router.get('/status/:id/:status', passport.authenticate('jwt', { session: false}),updateCarModelStatus); router.get('/car-model-list', passport.authenticate('jwt', { session: false}),  carModelList); 

module.exports = router;

function carModelIndex(req, res){
  var token = getToken(req.headers);
  if (token) {
    if(!req.body.page) req.body.page = 1;
    if(!req.body.name) req.body.name = '';
   /*  AdminCarModel.paginate({
      is_deleted: 0,
      name:{ $regex: '.*' + req.body.name + '.*' }
    },{page:req.body.page, limit: global.ADMIN_PER_PAGE_RECORD },function (err, data) {
      if (err) return next(err); 
      res.json(data); 
    }); */
    AdminCarModel.find({
      is_deleted: 0,
      name:{ $regex: '.*' + req.body.name + '.*' }
    },function (err, data) {
      if (err) return next(err); 
      res.json(data); 
    }).sort({createdAt:'desc'});
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function saveCarModel(req, res,next){  
  var token = getToken(req.headers); 
  if (token) { 
    var newCarModel = new AdminCarModel({
      name: req.body.name,
      qty_of_passenger: req.body.qty_of_passenger
    }); 

    newCarModel.save()
      .then(() =>  res.json({success: true, msg: 'Car model added successfully..'}))
      .catch(err => 
          next(err)
        ); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }  
}

function editCarModel(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminCarModel.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      res.json(data); 
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function updateCarModel(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminCarModel.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.name             = req.body.name;
      data.qty_of_passenger = req.body.qty_of_passenger;
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Car model Language successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function deleteCarModel(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminCarModel.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.is_deleted = 1;
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Car model deleted successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function updateCarModelStatus(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id && req.params.status) { 
    AdminCarModel.findById(req.params.id, function(err, data) {
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

function carModelList(req, res){
  var token = getToken(req.headers);
  if (token) {
    AdminCarModel.find({
      is_deleted: 0,
      is_active: 1
    },function (err, data) {
      if (err) return next(err); 
      res.json(data);   
    }).select("name");
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
