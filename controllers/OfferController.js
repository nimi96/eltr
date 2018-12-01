/* var express = require('express');
var router = express.Router(); */

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router(); 
var AdminOffer = require("../models/AdminOffer"); 
var BookTaxi = require("../webservice/models/BookTaxi"); 
var async     = require('async');

router.post('/list', passport.authenticate('jwt', { session: false}),  offerIndex);  
router.get('/view/:id', passport.authenticate('jwt', { session: false}),  viewOffer);  
router.get('/update-status/:id/:status', passport.authenticate('jwt', { session: false}),  updateOfferStatus);  

module.exports = router;

function offerIndex(req, res,next){
  var token = getToken(req.headers); 
  if (token) {
    if(!req.body.page) req.body.page = 1;
    if(!req.body.name) req.body.name = '';
    AdminOffer.find({
      is_deleted: 0, 
      car_number:{ $regex: '.*' + req.body.car_number + '.*' }
      //name:{ $regex: '.*' + req.body.car_model + '.*' }
    })
    .populate({path: 'driver_id', select: 'full_name',match: { full_name: { $regex: '.*' + req.body.driver + '.*' } }})
    .populate({path: 'car_model_id', select: 'name',match: { name: { $regex: '.*' + req.body.car_model + '.*' }}})
    .sort({createdAt:'desc'})
    .exec(function(err, result){  
      if (err) return next(err);  
      result = result.filter(function(doc){  
        if((doc.car_model_id != null) && (doc.car_model_id.name != '') && (doc.driver_id != null) && (doc.driver_id.full_name != '') ){ 
          return doc;
        }
      })
      res.json(result);  
   });
    /* AdminOffer.find({
      is_deleted: 0, 
      car_number:{ $regex: '.*' + req.body.car_number + '.*' }
      //name:{ $regex: '.*' + req.body.car_model + '.*' }
    },function (err, data) { 
      if (err) return next(err); 
      res.json(data); 
    }).populate({path: 'driver_id', select: 'full_name',match: { full_name: { $regex: '.*' + req.body.driver + '.*' } }}).populate({path: 'car_model_id', select: 'name',match: { name: { $regex: '.*' + req.body.car_model + '.*' }}}).sort({createdAt:'desc'}).exec(function(err, users) {
      users = users.filter(function(user) {
        return user.email; // return only users with email matching 'type: "Gmail"' query
      });
    }); */
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}

function viewOffer(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id) {   
    AdminOffer.findById(req.params.id , function(err, data) {  
      if (!data) {
        res.json({success: false,msg: 'Invalid offer id.'});
      } else {  
        var offerData = JSON.stringify(data);
        offerData = JSON.parse(offerData);
        var total_taxi_amount   = ((offerData.qty_of_passenger-offerData.pending_seat)*offerData.cost);
        var total_parcel_amount =  offerData.parcel_cost; 
        var total_amount =  Number(total_taxi_amount+total_parcel_amount).toFixed(2); 
        data.set('total_taxi_amount',total_taxi_amount,{strict:false}); 
        data.set('total_parcel_amount',total_parcel_amount,{strict:false}); 
        data.set('total_trip_amount',total_amount,{strict:false}); 
        BookTaxi.find({driver_id:data.driver_id,offer_id:data._id}, function(err, orderData) {
          if (err) return next(err);  
          async.forEach(orderData,function(item,callback) {  
            var passengerData = JSON.stringify(item.passenger_id);
            passengerData = JSON.parse(passengerData);
            if(passengerData.profile_image && passengerData.profile_image != ''){
              var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+passengerData.profile_image; 
            }else{
              var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+'no_image.png';
            }
            item.set('profile_image_path',profile_image_path,{strict:false}); 
              callback(); 
          }, function(err) { 
            res.json({success: true,data:data,orderData:orderData});
          });  
              
        }).populate({path: 'passenger_id'}).sort({createdAt:'desc'});  
      } 
    }).populate({path: 'car_model_id', select: 'name'}).populate({path: 'driver_id'})

  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
}
 
function updateOfferStatus(req, res,next){  
  var token = getToken(req.headers); 
  if (token && req.params.id && req.params.status) { 
    AdminOffer.findById(req.params.id, function(err, data) {
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
