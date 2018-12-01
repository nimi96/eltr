/* var express = require('express');
var router = express.Router(); */

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router(); 
var AdminUser = require("../models/AdminUser"); 
var AdminCarModel = require("../models/AdminCarModel"); 
var AdminOffer = require("../models/AdminOffer"); 

router.post('/dashboard', passport.authenticate('jwt', { session: false}),  dashboardData); 
 
router.post('/passenger/list', passport.authenticate('jwt', { session: false}),  passengerList); 
router.post('/passenger/save', passport.authenticate('jwt', { session: false}),  savePassenger);  
router.get('/passenger/delete/:id', passport.authenticate('jwt', { session: false}),  deletePassenger); 
router.get('/passenger/edit/:id', passport.authenticate('jwt', { session: false}),  editPassenger); 
router.post('/passenger/update/:id', passport.authenticate('jwt', { session: false}),  updatePassenger);
router.get('/passenger/status/:id/:status', passport.authenticate('jwt', { session: false}),updatePassengerStatus); 

router.post('/driver/list', passport.authenticate('jwt', { session: false}),  driverList); 
router.post('/driver/save', passport.authenticate('jwt', { session: false}),  saveDriver);  
router.get('/driver/delete/:id', passport.authenticate('jwt', { session: false}),  deleteDriver); 
router.get('/driver/edit/:id', passport.authenticate('jwt', { session: false}),  editDriver); 
router.post('/driver/update/:id', passport.authenticate('jwt', { session: false}),  updateDriver);
router.get('/driver/status/:id/:status', passport.authenticate('jwt', { session: false}),updateDriverStatus); 
router.get('/driver/approve-status/:id/:status', passport.authenticate('jwt', { session: false}),approveDriverStatus); 

module.exports = router;

function dashboardData(req, res){
  var token = getToken(req.headers);
  console.log("ok")
  if (token) {
    var result  = [] ;

    AdminUser.AdminDriverSchema.count({
      user_role_id: 3,
      is_deleted:0
    }, function (err, driver) {
      if (err) return next(err); 
      result.push({'totalDriver':driver});
      
      AdminUser.AdminPassengerSchema.count({
        user_role_id: 2,
        is_deleted:0
      }, function (err, record) {
        if (err) return next(err);  
        result.push({'totalPassenger':record});
        
        AdminCarModel.count({ 
          is_deleted:0
        }, function (err, car) {
          if (err) return next(err);
          result.push({'totalCarmodel':car});  
          
          AdminOffer.count({ 
            is_deleted:0
          }, function (err, offer) {
            if (err) return next(err);
            result.push({'totalOffer':offer}); 
            res.json(result); 
          }); 
        }); 
      }); 
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function passengerList(req, res){
  var token = getToken(req.headers);
  if (token) {
    AdminUser.AdminPassengerSchema.find({
      user_role_id: 2,
      is_deleted:0,
      full_name:{ $regex: '.*' + req.body.full_name + '.*' },
      phone_number:{ $regex: '.*' + req.body.phone_number + '.*' }
    },function (err, users) {
      if (err) return next(err);
      res.json(users);
    }).sort({createdAt:'desc'});
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function savePassenger(req, res,next){ 
  var token = getToken(req.headers);
  if (token) {
    var newUser = new AdminUser.AdminPassengerSchema({
      full_name: req.body.full_name, 
      phone_number: req.body.phone_number, 
      user_role_id: 2
    }); 

    newUser.save()
        .then(() =>  res.json({success: true, msg: 'Passenger added successfully.'}))
        .catch(err => 
            next(err)
          );   
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function editPassenger(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminUser.AdminPassengerSchema.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      res.json(data); 
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function updatePassenger(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminUser.AdminPassengerSchema.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.full_name    = req.body.full_name;
      data.phone_number = req.body.phone_number;
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Passenger updated successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function deletePassenger(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminUser.AdminPassengerSchema.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.is_deleted = 1;
      data.phone_number = (data.phone_number+"_"+Date.now());
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Passenger deleted successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function updatePassengerStatus(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id && req.params.status) { 
    AdminUser.AdminPassengerSchema.findById(req.params.id, function(err, data) {
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

function driverList(req, res){
  var token = getToken(req.headers);
  if (token) {
    AdminUser.AdminDriverSchema.find({
      user_role_id: 3,
      is_deleted:0,
      full_name:{ $regex: '.*' + req.body.full_name + '.*' },
      phone_number:{ $regex: '.*' + req.body.phone_number + '.*' }
    },function (err, users) {
      if (err) return next(err);
      res.json(users);
    }).sort({createdAt:'desc'});
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function saveDriver(req, res,next){ 
  var token = getToken(req.headers);
  if (token) {
    var newUser = new AdminUser.AdminDriverSchema({
      full_name: req.body.full_name, 
      phone_number: req.body.phone_number, 
      car_model_id: req.body.car_model_id, 
      qty_of_passenger: req.body.qty_of_passenger, 
      car_number: req.body.car_number, 
      user_role_id: 3,
      is_approved: 1
    }); 

    newUser.save()
        .then(() =>  res.json({success: true, msg: 'Driver added successfully.'}))
        .catch(err => 
            next(err)
          );   
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function editDriver(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminUser.AdminDriverSchema.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      res.json(data); 
    }).populate({path: 'car_model_id', select: 'name'}); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function updateDriver(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminUser.AdminDriverSchema.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here  
      data.full_name =  req.body.full_name, 
      data.phone_number =  req.body.phone_number, 
      data.car_model_id =  req.body.car_model_id, 
      data.qty_of_passenger =  req.body.qty_of_passenger, 
      data.car_number =  req.body.car_number, 
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Driver updated successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function deleteDriver(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) { 
    AdminUser.AdminDriverSchema.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.is_deleted = 1;
      data.phone_number = (data.phone_number+"_"+Date.now());
  
      data.save() 
      .then(() =>  res.json({success: true, msg: 'Driver deleted successfully..'}))
      .catch(err => 
          next(err)
        );   
    }); 
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function updateDriverStatus(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id && req.params.status) { 
    AdminUser.AdminDriverSchema.findById(req.params.id, function(err, data) {
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

function approveDriverStatus(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id && req.params.status) { 
    AdminUser.AdminDriverSchema.findById(req.params.id, function(err, data) {
      if (err) return next(err);
      // do your updates here
      data.is_approved = req.params.status;
  
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
