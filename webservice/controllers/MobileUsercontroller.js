var mongoose              = require('mongoose');
var passport              = require('passport'); 
var config                = require('../../config/database');
var express               = require('express');
var jwt                   = require('jsonwebtoken');
var router                = express.Router();  
var User                  = require("../models/MobileUser"); 
var CarModel              = require("../models/CarModel");  
var Offer                 = require("../models/Offer"); 
var SearchTaxi            = require("../models/SearchTaxi"); 
var BookTaxi              = require("../models/BookTaxi"); 
var Feedback              = require("../models/Feedback"); 
var MobileUserSetting     = require("../models/MobileUserSetting"); 
var UserChat              = require("../models/UserChat"); 
var Favorite              = require("../models/Favorite"); 
var UserOtp               = require("../models/UserOtp"); 
var SingleUser            = require("../../models/User"); 
var Schema                = mongoose.Schema;  
var jwt                   = require('jsonwebtoken');  
var fs		    	          = require('fs');
var formidable	          = require('formidable'); 
var CmsPage               =  mongoose.model('CmsPage', new Schema({ name: String,slug:String,body:String })); 
var async                 = require('async');
var FCM 				          = require('fcm-push');
var PushNotifications     = require('node-pushnotifications'); 
var apns                  = require("apns"); 
const PushNotification = require('push-notification');
const DeviceType = PushNotification.DeviceType;
//const curl                = new (require( 'curl-request' ))();
var request = require('request');
 
Array.prototype.keySort = function(keys) { 
  keys = keys || {};
  var obLen = function(obj) {
  var size = 0, key;
  for (key in obj) {
  if (obj.hasOwnProperty(key))
  size++;
  }
  return size;
  };
  var obIx = function(obj, ix) {
  var size = 0, key;
  for (key in obj) {
  if (obj.hasOwnProperty(key)) {
  if (size == ix)
  return key;
  size++;
  }
  }
  return false;
  };
  var keySort = function(a, b, d) {
  d = d !== null ? d : 1;
  if (a == b)
  return 0;
  return a > b ? 1 * d : -1 * d;
  };
  var KL = obLen(keys);
  if (!KL) return this.sort(keySort);
  for ( var k in keys) {
  keys[k] = 
  keys[k] == 'desc' || keys[k] == -1 ? -1 
  : (keys[k] == 'skip' || keys[k] === 0 ? 0 
  : 1);
  }
  this.sort(function(a, b) {
  var sorted = 0, ix = 0;
  while (sorted === 0 && ix < KL) {
  var k = obIx(keys, ix);
  if (k) {
  var dir = keys[k];
  sorted = keySort(a[k], b[k], dir);
  ix++;
  }
  }
  return sorted;
  });
  return this;
};

router.post('/user-otp', sendOTP);    
router.post('/verify-otp', verifyOTP);    
router.post('/logout', logout);    
router.post('/signup', signup);    
router.get('/car-model-list', carModelList);    
router.post('/driver-signup', driverSignup);    
router.post('/create-offer', createOffer);    
router.post('/driver-offer-list', driverOfferList);    
router.post('/user-profile', userProfile);    
router.post('/offer-detail', OfferDetail);    
router.post('/upload-image',uploadImage);    
router.post('/settings',userSettings);    
router.post('/update-settings',updateUserSettings);  
router.post('/terms-and-condition',termsAndCondition);  
router.post('/update-profile',updateProfile); 
router.post('/unlink-profile',unlinkProfile); 

/* After login routing*/
router.post('/search-taxi-parcel',searchTaxiParcel); 
router.post('/taxi-parcel-offer-list',taxiParcelOfferList); 
router.post('/book-taxi',bookTaxi); 
router.post('/driver-mark-as-full-parcel',markAsFullParcel); 
router.post('/driver-current-request',driverCurrentRequest); 
router.post('/update-passenger-booking-status',updatePassengerBookingStatus); 
router.post('/driver-profile-at-passenger-end',driverProfilePassengerEnd); 
router.post('/update-status-all-orders',updateStatusAllOrders); 
router.post('/passenger-current-request',passengerCurrentRequest); 
router.post('/driver-trips',driverTrips); 
router.post('/passenger-trips',passengerTrips);  
router.post('/driver-trip-detail',driverTripsDetail); 
router.post('/passenger-trip-detail',passengerTripDetail);  
router.post('/submit-driver-feedback',submitDriverFeedback);  
router.post('/driver-feedback-list',driverFeedbackList);  
router.get('/send-notification',sendNotification);  
router.get('/ios-send-notification',sendIOSNotification);  
router.post('/mark-favorite-driver',markFavoriteDriver);  

/* user chats routing */
router.post('/save-user-chat',saveUserChat); 
router.post('/offer-user-chats',offerUserChat); 

router.post('/send-sms',sendSMS); 

module.exports = router;

function sendSMS(){

  request.post({url:'http://185.8.212.184/smsgateway/', form: {
    'login': 'whitehouse',
    'password': 'H28a02ImfGn0nQnPfDwi',
    'data': '[ {"phone":"998945005554", "text":"Ваш текст смс"} ]'
  }}, function(err,httpResponse,body){ 
    console.log(err, httpResponse, body)
   })

  /* 
  curl.setBody({
    'login': 'whitehouse',
    'password': 'H28a02ImfGn0nQnPfDwi',
    'data': '[ {"phone":"998945005554", "text":"Ваш текст смс"} ]'
  })
  .get('http://185.8.212.184/smsgateway/')
  .then(({statusCode, body, headers}) => {
      console.log(statusCode, body, headers)
  })
  .catch((e) => {
      console.log(e);
  }); */
}

function sendOTP(req, res,next){   
  var errorMsg  = '';
  if (!req.body.lang) { 
    errorMsg += 'lang field is required.';
    res.json({success: false, msg: errorMsg});
  }else  if (!req.body.phone_number) { 
     errorMsg += 'Phone number field is required.';
     res.json({success: false, msg: errorMsg});
  }else {   
    //var random_no = Math.floor(100000 + Math.random() * 900000);
    var random_no = "123456";
    var lang = req.body.lang;

    request.post({url:'http://185.8.212.184/smsgateway/', form: {
    'login': 'whitehouse',
    'password': 'H28a02ImfGn0nQnPfDwi',
    'data': '[ {"phone":"'+req.body.phone_number+'", "text":"'+global[lang+"_your_otp_is"]+' '+random_no+'"} ]'
  }}, function(err,httpResponse,body){ 
    //console.log(err, httpResponse, body)
   });

    /* curl.setBody({
      'login': 'whitehouse',
      'password': 'H28a02ImfGn0nQnPfDwi',
      'data': '[ {"phone":"'+req.body.phone_number+'", "text":"Your otp is '+random_no+'."} ]'
    })
    .get('http://185.8.212.184/smsgateway/')
    .then(({statusCode, body, headers}) => {
       // console.log(statusCode, body, headers)
    })
    .catch((e) => {
       // console.log(e);
    }); */
    var query = {
      phone_number: req.body.phone_number
    },
    update = {
       phone_number: req.body.phone_number,
       otp:random_no
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    User.PassengerSchema.findOne({
      phone_number: req.body.phone_number,
      is_deleted:0
    }, function(err, user) { 
      if (!user) {  
        User.DriverSchema.findOne({
          phone_number: req.body.phone_number, 
          is_deleted:0
        }, function(err, user) {  
          if (!user) {
            UserOtp.findOneAndUpdate(query, update, options, function(err, data){
              if (err) return next(err);  
              res.json({success: true, otp: random_no, msg:global[lang+"_otp_sent_successfully"]}); 
            });  
          }else if(user.is_active == 0){
            res.json({success: false, otp: '', msg:global[lang+"_your_account_has_been_deactivated_Please_contact_to_admin"]});
          }else{
            UserOtp.findOneAndUpdate(query, update, options, function(err, data){
              if (err) return next(err);  
              res.json({success: true, otp: random_no, msg:global[lang+"_otp_sent_successfully"]}); 
            }); 
          }
        });  
      }else if(user.is_active == 0){
        res.json({success: false, otp: '', msg: global[lang+"_your_account_has_been_deactivated_Please_contact_to_admin"]});
      }else{
        UserOtp.findOneAndUpdate(query, update, options, function(err, data){
          if (err) return next(err);  
          res.json({success: true, otp: random_no, msg:global[lang+"_otp_sent_successfully"]}); 
        });
      }
    });  
  }  
}

function logout(req, res,next){   
  var errorMsg  = '';
  if (!req.body.user_id) { 
     errorMsg += 'User id is required.,';
  }
  if (!req.body.user_role_id) { 
     errorMsg += 'User role is required.';
  }
  if (!req.body.user_id || !req.body.user_role_id) {
    res.json({success: false, msg: errorMsg});
  } else { 
    if(req.body.user_role_id == 2){ 
      User.PassengerSchema.findOne({_id:req.body.user_id}, function(err, data) { 
        if (err) return next(err);
        // do your updates here  
        data.device_id =  data.device_id+Date.now();  
        data.save() 
        .then(()=>
          res.json({success: true,token:'',msg: 'User logged out successfully.'})
        ).catch(err => 
          next(err)
        );   
      });
    }else if(req.body.user_role_id == 3){
      User.DriverSchema.findOne({_id:req.body.user_id}, function(err, data) { 
        if (err) return next(err);
        // do your updates here  
        data.device_id =  data.device_id+Date.now();  
        data.save() 
        .then(()=>
          res.json({success: true,token:'',msg: 'User logged out successfully.'})
        ).catch(err => 
          next(err)
        );   
      });
    }else{
      res.json({success: false,msg: 'Something went wrong.'});
    }
  } 
}

function verifyOTP(req, res,next){  
  var errorMsg  = '';
  if (!req.body.device_id) { 
     errorMsg += 'Device id is required.';
  }
  if (!req.body.device_type) { 
     errorMsg += 'Device type is required.';
  }
  if (!req.body.phone_number) { 
     errorMsg += 'Phone number field is required.';
  }
  if (!req.body.lang) { 
     errorMsg += 'lang field is required.';
  }
  if (!req.body.otp){ 
    errorMsg += ' Otp field is required.';
  } 
  if (!req.body.otp || !req.body.phone_number || !req.body.device_type || !req.body.device_id) {
    res.json({success: false, msg: errorMsg});
  } else {  
    //var random_no = Math.floor(100000 + Math.random() * 900000);
    var random_no = 0;
    var lang = req.body.lang;
    var query = {
      phone_number: req.body.phone_number
    },
    update = {
       phone_number: req.body.phone_number,
       otp:random_no
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

    UserOtp.findOne({phone_number: req.body.phone_number}, function(err, data){
      if (err) return next(err);  
      
      if(data.otp != req.body.otp){
        errorMsg += global[lang+"_otp_does_not_match"];
        res.json({success: false, msg:errorMsg});
      }else{  
        UserOtp.findOneAndUpdate(query, update, options, function(err, data){
          if (err) return next(err);   
        });
        User.PassengerSchema.findOne({
          phone_number: req.body.phone_number,
          is_deleted:0,
          user_role_id:2
        }, function(err, user) { 
          if (!user) {  
            User.DriverSchema.findOne({
              phone_number: req.body.phone_number, 
              is_deleted:0,
              user_role_id:3
            }, function(err, user) {  
              if (!user) {
                //res.json({success: true,msg: 'User created successfully.'});
                res.json({success: true,token:'',msg:global[lang+"_otp_verified_successfully"]}); 
              } else { 
                
                User.DriverSchema.findOne({phone_number:req.body.phone_number}, function(err, data) { 
                  if (err) return next(err);
                  // do your updates here  
                  
                  data.device_type =  req.body.device_type;
                  data.device_id   =  req.body.device_id; 
                  data.save();   
                });

                if(!user.profile_image){
                  user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+'no_image.png',{strict:false});
                } else{
                  user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+''+user.profile_image,{strict:false});
                } 
                user.set('document_path',global.DOCUMENT_IMAGE_ROOT_PATH+''+user.document,{strict:false});
                user.set('driving_licence_path',global.LICENCE_IMAGE_ROOT_PATH+''+user.driving_licence,{strict:false});
                var car_model_id = user.car_model_id;
                CarModel.findOne({_id:car_model_id}, function(err, carData1) { 
                  user.set('car_name','',{strict:false});
                  if(carData1){ 
                    user.set('car_name',carData1.toObject().name,{strict:false});
                  } 
                  // if user is found and password is right create a token
                  var token = jwt.sign(user.toJSON(), config.secret); 
                  // return the information including token as JSON
                  res.json({success: true,token:token,user:user,msg:global[lang+"_you_are_successfully_logged_in"] }); 
                }); 
              }
            });  
          } else {  
            if(!user.profile_image){
              user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+'no_image.png',{strict:false});
            } else{
              user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+''+user.profile_image,{strict:false});
            }

            
            User.PassengerSchema.findOne({phone_number:req.body.phone_number}, function(err, data) { 
              if (err) return next(err);
              // do your updates here 
              data.device_type =  req.body.device_type;
              data.device_id   =  req.body.device_id; 
              data.save() 
              .then().catch(err => 
                  next(err)
                );   
            });

            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret); 
            // return the information including token as JSON
            res.json({success: true, token:token,user:user,msg:global[lang+"_you_are_successfully_logged_in"]});  
          }
        });  
      }
    });
  } 
}

function signup(req, res,next){  
  var userData = new User.PassengerSchema({
    full_name: req.body.full_name, 
    phone_number: req.body.phone_number, 
    user_role_id: req.body.user_role_id,
    device_id:req.body.device_id,
    device_type:req.body.device_type
  }); 
  var lang = req.body.lang;
  userData.save()
    .then(() =>  
          User.PassengerSchema.findOne({
            phone_number: req.body.phone_number,
            user_role_id: req.body.user_role_id
          }, function(err, user) { 
            if (err) throw err; 
            if (!user) {
              res.json({success: true,msg:global[lang+"_user_created_successfully"]});
            } else {  

              global.USERSETTINGS.forEach(element => {
                var settingData = new MobileUserSetting({
                  user_id: user._id, 
                  name: element.name, 
                  status: 1 
                });  
                settingData.save()
                  .then( 
                  ).catch(err => 
                      next(err)
                    );
              });
              
              // if user is found and password is right create a token
              var token = jwt.sign(user.toJSON(), config.secret); 
              // return the information including token as JSON
              res.json({success: true, token:token,user:user,msg:global[lang+"_user_created_successfully"]}); 
            }
          })//, 
       // res.json({success: true, msg: 'User created successfully.'})
    )
    .catch(err => 
      { 
        if (err) { 
          var errorMsg	=	"";
          var lang	=	req.body.lang;
            switch (err.name) { 
                case 'ValidationError':
                for (field in err.errors) {
                    switch (err.errors[field].message) {
                    case '':
                        errorMsg	+=	"Something went wrong.,";
                        break;
                    default: 
                       errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                        break; 
                    }
                }
                break;
                case 'MongoError':
                errorMsg	+=	"Duplicate key.";
                default:
                errorMsg	+=	"Something went wrong.,";
            }
        }
        errorMsg.replace(/,+$/,'');
        return res.status(400).json({success: false, msg: errorMsg });
       }
      );   
}

function carModelList(req, res,next){  
  CarModel.find({
    is_deleted: 0,
    is_active:1
  },function (err, data) { 
    if (err) return next(err); 
    res.json({success: true, data: data});
  }).select('name qty_of_passenger');
}

function driverSignup(req, res,next){ 
  var profile_image_name  = "";
  var document_name  = "";
  var driving_licence_name  = "";
  var form = new formidable.IncomingForm(); 
  form.parse(req, function (err, fields, files) {  
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12 
    var year = dateObj.getUTCFullYear();
    var lang = fields.lang;   
    if(files.profile_image){
      var file_name = Date.now()+ '_' +files.profile_image.name; 
      profile_image_name  = month+''+year+'/'+file_name;
    }  
    if(files.document){ 
      var file_name = Date.now()+ '_' +files.document.name;  
      document_name  = month+''+year+'/'+file_name;
    }  
    if(files.driving_licence){ 
      var file_name = Date.now()+ '_' +files.driving_licence.name; 
      driving_licence_name  = month+''+year+'/'+file_name;
    }  
    var userData = new User.DriverSchema({
      full_name: fields.full_name, 
      phone_number: fields.phone_number, 
      user_role_id: fields.user_role_id,
      car_model_id: fields.car_model_id,
      qty_of_passenger: fields.qty_of_passenger, 
      car_number: fields.car_number,
      profile_image: profile_image_name,
      driving_licence:driving_licence_name,
      document:document_name,
      doc_title:fields.doc_title,
      device_id:fields.device_id,
      device_type:fields.device_type
    }); 

    userData.save()
      .then(() =>  
        User.DriverSchema.findOne({
          phone_number: fields.phone_number,
          user_role_id: fields.user_role_id
        }, function(err, user) {  
          if (err) throw err; 
          if (!user) {
            res.json({success: true,msg:
              global[lang+"_user_does_not_created"]});
          } else {    
            if(profile_image_name){
              var folderProfile  = global.PROFILE_UPLOADS_ROOT_PATH+month+year;
              var oldpath = files.profile_image.path; 
              fs.exists(folderProfile, function(exists) {
                if (exists) {
                  var newpath = global.PROFILE_UPLOADS_ROOT_PATH+"/"+profile_image_name;
                  fs.rename(oldpath, newpath, function (err) {
                    if (err) throw err;
                  });
                }else{
                  fs.mkdir(folderProfile, function(err) {
                    if(err) {
                    }else{
                      var newpath = global.PROFILE_UPLOADS_ROOT_PATH+"/"+profile_image_name;
                      fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err; 
                      });
                    }
                  });
                }
              }); 
            }
              
            if(driving_licence_name){
              var folderLicence  = global.LICENCE_UPLOADS_ROOT_PATH+month+year; 
              var preLinpath = files.driving_licence.path;
              var newpath = global.LICENCE_UPLOADS_ROOT_PATH+"/"+driving_licence_name;
              fs.exists(folderLicence, function(exists) {
                if (exists) {
                  fs.rename(preLinpath, newpath, function (err) {
                    if (err) throw err;
                  });
                }else{
                  fs.mkdir(folderLicence, function(err) {
                    if(err) {
                    }else{ 
                      fs.rename(preLinpath, newpath, function (err) {
                        if (err) throw err;  
                      });
                    }
                  });
                }
              }); 
            }

            if(document_name){
              var folderDocument  = global.DOCUMENT_UPLOADS_ROOT_PATH+month+year; 
              var docOldpath = files.document.path;
              fs.exists(folderDocument, function(exists) {
                if (exists) {
                  var newpath = global.DOCUMENT_UPLOADS_ROOT_PATH+"/"+document_name;
                  fs.rename(docOldpath, newpath, function (err) {
                    if (err) throw err;
                  });
                }else{
                  fs.mkdir(folderDocument, function(err) {
                    if(err) {
                    }else{
                      var newpath = global.DOCUMENT_UPLOADS_ROOT_PATH+"/"+document_name;
                      fs.rename(docOldpath, newpath, function (err) {
                        if (err) throw err; 
                      });
                    }
                  });
                }
              }); 
            } 

            
            global.USERSETTINGS.forEach(element => {
              var settingData = new MobileUserSetting({
                user_id: user._id, 
                name: element.name, 
                status: 1 
              });  
              settingData.save()
                .then( 
                ).catch(err => 
                    next(err)
                  );
            });
            
            user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+''+profile_image_name,{strict:false});
            user.set('document_path',global.DOCUMENT_IMAGE_ROOT_PATH+''+document_name,{strict:false});
            user.set('driving_licence_path',global.LICENCE_IMAGE_ROOT_PATH+''+driving_licence_name,{strict:false});
            var car_model_id = user.car_model_id;
            CarModel.findOne({_id:car_model_id}, function(err, carData1) { 
              user.set('car_name','',{strict:false});
              if(carData1){ 
                user.set('car_name',carData1.toObject().name,{strict:false});
              } 
              // if user is found and password is right create a token
              var token = jwt.sign(user.toJSON(), config.secret); 
              // return the information including token as JSON
              res.json({success: true, token:token,user:user,msg:global[lang+"_user_created_successfully"]});
            }); 
          }
        }) 
      ).catch(err =>
        { 
          if (err) { 
            var errorMsg	=	"";
            var lang	=	req.body.lang;
              switch (err.name) { 
                  case 'ValidationError':
                  for (field in err.errors) {
                      switch (err.errors[field].message) {
                      case '':
                          errorMsg	+=	"Something went wrong.,";
                          break;
                      default: 
                         errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                          break; 
                      }
                  }
                  break;
                  case 'MongoError':
                  errorMsg	+=	"Duplicate key.";
                  default:
                  errorMsg	+=	"Something went wrong.,";
              }
          }
          errorMsg.replace(/,+$/,'');
          return res.status(400).json({success: false, msg: errorMsg });
         }
      );
  });  
}

function createOffer(req, res,next){
  if(!req.body.driver_id){
    res.json({success: false,msg: 'Driver id is required.'});
  }else{  
    var lang = req.body.lang;
    User.DriverSchema.findOne({
      _id: req.body.driver_id,
      user_role_id:3
    }, function(err, user) {  
      if (err) {
        res.json({success: false,msg:global[lang+"_driver_is_not_approved_activated_by_admin"]}); 
      } else {   
          user = JSON.stringify(user); 
          user = JSON.parse(user); 
          Offer.find({driver_id:req.body.driver_id,
            is_deleted: 0,is_complete_offer:[0,1]},function (err, data) {  
            if (err) { 
              return;
            }  
            if(data &&  data != ""){
              res.json({success: false,msg:global[lang+"_you_have_already_created_a_offer_Please_finish_them"]}); 
            }else{

              if(user.is_approved && user.is_approved == 1 && user.is_active && user.is_active == 1){ 
                var offferData = new Offer({
                  source: req.body.source, 
                  destination: req.body.destination, 
                  source_lat: req.body.source_lat,
                  source_long: req.body.source_long,
                  destination_lat: req.body.destination_lat, 
                  destination_long: req.body.destination_long,
                  qty_of_passenger: req.body.qty_of_passenger, 
                  pending_seat: req.body.qty_of_passenger, 
                  cost: req.body.cost,
                  driver_id: req.body.driver_id,
                  is_parcel_enable: req.body.is_parcel_enable,
                  parcel_cost: req.body.parcel_cost,
                  car_model_id: req.body.car_model_id,
                  car_number: req.body.car_number
                }); 
    
                offferData.save()
                  .then(() =>   
                    res.json({success: true, msg:global[lang+"_offer_created_successfully"]})
                  ).catch(err => 
                    { 
                      if (err) { 
                        var errorMsg	=	"";
                        var lang	=	req.body.lang;
                          switch (err.name) { 
                              case 'ValidationError':
                              for (field in err.errors) {
                                  switch (err.errors[field].message) {
                                  case '':
                                      errorMsg	+=	"Something went wrong.,";
                                      break;
                                  default: 
                                     errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                                      break; 
                                  }
                              }
                              break;
                              case 'MongoError':
                              errorMsg	+=	"Duplicate key.";
                              default:
                              errorMsg	+=	"Something went wrong.,";
                          }
                      }
                      errorMsg.replace(/,+$/,'');
                      return res.status(400).json({success: false, msg: errorMsg });
                     }
                    );   
              }else{
                res.json({success: false,msg:global[lang+"_driver_is_not_approved_activated_by_admin"]}); 
              }
            } 
          }); 
      }
    }).select("is_approved is_active");
  }    
}

function driverOfferList(req, res,next){  
  if (!req.body.driver_id) { 
    res.json({success: false, msg: 'Driver id is required.'});
  } else {   
    Offer.find({driver_id:req.body.driver_id,
      is_deleted: 0,is_complete_offer:[0,1]},function (err, data) {  
      if (err) { 
        return;
      } 
      res.json({success: true, data: data});
    }).populate({path: 'car_model_id', select: 'name'}).sort({createdAt:'desc'});
  }
}
 
function userProfile(req, res,next){   
  if (!req.body.user_id){ 
    res.json({success: false, msg: 'User id is required.'});
  } else {   
    if(req.body.user_role_id == 2){ 
      User.PassengerSchema.findOne({
        _id: req.body.user_id,
        user_role_id: req.body.user_role_id
      }, function(err, user) {  
        if (!user) {
          res.json({success: false,msg: 'Invalid user id.'});
        } else {  
          if(user.profile_image){
            user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+''+user.profile_image,{strict:false});
          }else{
            user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+'no_image.png',{strict:false});
          }
          res.json({success: true,data:user}); 
        }
      }); 
    }else if(req.body.user_role_id == 3){
      User.DriverSchema.findOne({
        _id: req.body.user_id,
        user_role_id: req.body.user_role_id
      }, function(err, user) {  
        if (!user) {
          res.json({success: false,msg: 'Invalid user id.'}); 
        } else {  
          user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+''+user.profile_image,{strict:false});
          user.set('document_path',global.DOCUMENT_IMAGE_ROOT_PATH+''+user.document,{strict:false});
          user.set('driving_licence_path',global.LICENCE_IMAGE_ROOT_PATH+''+user.driving_licence,{strict:false});
          var car_model_id = user.car_model_id;
          CarModel.findOne({_id:car_model_id}, function(err, carData1) { 
            user.set('car_name','',{strict:false});
            if(carData1){ 
              user.set('car_name',carData1.toObject().name,{strict:false});
            } 
            res.json({success: true,data:user}); 
          }); 
        }
      });  
    }else{
      res.json({success: false,msg: 'Invalid user id.'});
    }
  }  
}
 
function OfferDetail(req, res,next){   
  if (!req.body.driver_id){ 
    res.json({success: false, msg: 'Driver id is required.'});
  } else {   
    Offer.findOne({
      _id: req.body.offer_id, 
      driver_id: req.body.driver_id 
    }, function(err, data) {  
      if (!data) {
        res.json({success: false,msg: 'Invalid offer id.'});
      } else {  
        BookTaxi.find({driver_id:req.body.driver_id,offer_id:req.body.offer_id,status:[1,2,3]}, function(err, orderData) {
          if (err) return next(err);  
          async.forEach(orderData,function(item,callback) {  
            var passengerData = JSON.stringify(item.passenger_id);
            passengerData = JSON.parse(passengerData);
            if(passengerData && passengerData != ''){
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
  }  
}

function uploadImage(req, res,next){
    var form = new formidable.IncomingForm(); 
    var errorMsg  = '';
    form.parse(req, function (err, fields, files) { 
      var lang = fields.lang; 
      if(!fields.user_id){
        errorMsg  +=  'User id is required.';
      }
      if(!files.profile_image){
        errorMsg  +=  'Profile image is required.';
      }
      if(!fields.user_role_id){
        errorMsg  +=  'User role is required.';
      }
      if(!fields.user_id || !files.profile_image){
        res.json({success: false,msg: errorMsg}) 
      }
      if(files.profile_image && files.profile_image != ''){
        var profile_image_name  = "";
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12 
        var year = dateObj.getUTCFullYear(); 
        var file_name = Date.now()+ '_' +files.profile_image.name; 
        profile_image_name  = month+''+year+'/'+file_name;
      }else{
        res.json({success: false,msg: 'Profile image is required.'}) 
      }
      
      if(profile_image_name){
        var folderProfile  = global.PROFILE_UPLOADS_ROOT_PATH+month+year;
        var oldpath = files.profile_image.path; 
        fs.exists(folderProfile, function(exists) {
          if (exists) {
            var newpath = global.PROFILE_UPLOADS_ROOT_PATH+"/"+profile_image_name;
            fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
            });
          }else{
            fs.mkdir(folderProfile, function(err) {
              if(err) {
              }else{
                var newpath = global.PROFILE_UPLOADS_ROOT_PATH+"/"+profile_image_name;
                fs.rename(oldpath, newpath, function (err) {
                  if (err) throw err; 
                });
              }
            });
          }
        }); 

        if(fields.user_role_id == 2){
          User.PassengerSchema.findById(fields.user_id, function(err, data) {
            if (err) return next(err);
            // do your updates here    
            data.profile_image =  profile_image_name; 
            var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+profile_image_name;
            data.save() 
            .then(() =>    
                res.json({success: true,userImage:profile_image_path,msg:global[lang+"_profile_image_uploaded_successfully"]}) 
            ).catch(err => 
                next(err)
              );   
          });  
        }if(fields.user_role_id == 3){
          User.DriverSchema.findById(fields.user_id, function(err, data) {
            if (err) return next(err);
            // do your updates here    
            data.profile_image =  profile_image_name; 
            var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+profile_image_name;
            data.save() 
            .then(() =>    
                res.json({success: true,userImage:profile_image_path,msg:global[lang+"_profile_image_uploaded_successfully"]}) 
            ).catch(err => 
                next(err)
              );   
          }); 
        } 
      }
    }); 
}

function userSettings(req, res,next){  
  if (!req.body.user_id) { 
    res.json({success: false, msg: 'User id is required.'});
  } else {   
    MobileUserSetting.find({user_id:req.body.user_id},function (err, data) {  
      if (err) return next(err); 
      res.json({success: true, data: data,settings:global.USERSETTINGS});
    }).select('name status');
  }
}

function updateUserSettings(req, res,next){
    var errorMsg =  '' ;
    if(!req.body.user_id){ 
      errorMsg  +=  'User id is required.,';
    }  
    if(!req.body.name){ 
      errorMsg  +=  'Name is required.';
    }  
    if(!req.body.name || !req.body.user_id){
      res.json({success: false, msg: errorMsg}); 
    }else{
      var lang = req.body.lang;
      MobileUserSetting.findOne({
        user_id: req.body.user_id, 
        name: req.body.name 
      }, function(err, data) {  
        data.status =  req.body.status;  
        data.save() 
        .then(() =>    
            res.json({success: true,user:data,msg:global[lang+"_settings_updated_successfully"]}) 
        ).catch(err => 
            next(err)
          );   
      });   
    } 
}

function termsAndCondition(req, res,next){ 
  CmsPage.findOne({
    slug: "terms_and_condition" 
  }, function(err, result) { 
    if (err) throw err; 
    if (!result) { 
      res.json({success: false,msg: 'No record found.'}); 
    } else {   
      res.json({success: true, data:result}); 
    }
  }).select("name body"); 
}

function updateProfile(req, res,next){ 
  var form = new formidable.IncomingForm();   
  form.parse(req, function (err, fields, files) {
    var lang = fields.lang;
    if(!fields.user_role_id){
      res.json({success: false, msg: 'User role is required.'});
    }else if(!fields.user_id){
      res.json({success: false, msg: 'User id is required.'});
    }else if(fields.user_role_id == 2){  
      var profile_image_name  = "";
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12 
      var year = dateObj.getUTCFullYear();  
      if(files.profile_image){
        var file_name = Date.now()+ '_' +files.profile_image.name; 
        profile_image_name  = month+''+year+'/'+file_name;
      } 
      
      if(profile_image_name != ''){
        var folderProfile  = global.PROFILE_UPLOADS_ROOT_PATH+month+year;
        var oldpath = files.profile_image.path; 
        fs.exists(folderProfile, function(exists) {
          if (exists) {
            var newpath = global.PROFILE_UPLOADS_ROOT_PATH+"/"+profile_image_name;
            fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
            });
          }else{
            fs.mkdir(folderProfile, function(err) {
              if(err) {
              }else{
                var newpath = global.PROFILE_UPLOADS_ROOT_PATH+"/"+profile_image_name;
                fs.rename(oldpath, newpath, function (err) {
                  if (err) throw err; 
                });
              }
            });
          }
        }); 
      }

      User.PassengerSchema.findById(fields.user_id, function(err, data) {
        if (err) return next(err);
        // do your updates here  
        data.full_name =  fields.full_name;
        if(profile_image_name != ''){
          data.profile_image =  profile_image_name;
        }
        data.save() 
        .then(() =>    
            res.json({success: true,user:data,msg:global[lang+"_profile_updated_successfully"]}) 
        ).catch(err => 
            next(err)
          );   
      });  
    }else if(fields.user_role_id == 3){ 
      
      var profile_image_name  = ""; 
      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12 
      var year = dateObj.getUTCFullYear();  
      if(files.profile_image){
        var file_name = Date.now()+ '_' +files.profile_image.name; 
        profile_image_name  = month+''+year+'/'+file_name;
      }
       
      if(profile_image_name){
        var folderProfile  = global.PROFILE_UPLOADS_ROOT_PATH+month+year;
        var oldpath = files.profile_image.path; 
        fs.exists(folderProfile, function(exists) {
          if (exists) {
            var newpath = global.PROFILE_UPLOADS_ROOT_PATH+"/"+profile_image_name;
            fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
            });
          }else{
            fs.mkdir(folderProfile, function(err) {
              if(err) {
              }else{
                var newpath = global.PROFILE_UPLOADS_ROOT_PATH+"/"+profile_image_name;
                fs.rename(oldpath, newpath, function (err) {
                  if (err) throw err; 
                });
              }
            });
          }
        }); 
      }
 
      
      User.DriverSchema.findById(fields.user_id, function(err, data) {
        if (err) return next(err);
        // do your updates here  
        data.full_name =  fields.full_name;
        data.car_model_id =  fields.car_model_id;
        data.qty_of_passenger =  fields.qty_of_passenger;
        data.car_number =  fields.car_number; 
        if(profile_image_name != ''){
          data.profile_image =  profile_image_name;
        }
        data.save() 
        .then(() => 
          res.json({success: true,user:data,msg:global[lang+"_profile_updated_successfully"]})
        ).catch(err => 
            next(err)
          );   
      });    
    }else{
     res.json({success: false, msg: 'Something went wrong'});
    } 
  }); 
}

function unlinkProfile(req, res,next){  
    var errorMsg = '';
    if(!req.body.user_id){
      errorMsg  +=  'User id is required.';
    } 
    if(!req.body.user_role_id){
      errorMsg  +=  'User role is required.';
    }
    if(!req.body.user_id || !req.body.user_role_id){
      res.json({success: false,msg: errorMsg});
    } 
    var lang = req.body.lang;     
    if(req.body.user_role_id == 2){
      User.PassengerSchema.findById(req.body.user_id, function(err, data) {
        if (err) return next(err);
        // do your updates here    
        data.profile_image =  '';  
        data.save() 
        .then(() =>    
            res.json({success: true,msg:global[lang+"_profile_image_removed_successfully"]}) 
        ).catch(err => 
            next(err)
          );   
      });  
    }else if(req.body.user_role_id == 3){
      User.DriverSchema.findById(req.body.user_id, function(err, data) {
        if (err) return next(err);
        // do your updates here    
        data.profile_image =  '';  
        data.save() 
        .then(() =>    
          res.json({success: true,msg:global[lang+"_profile_image_removed_successfully"]}) 
        ).catch(err => 
            next(err)
          );   
      }); 
    }  
}

function searchTaxiParcel(req, res,next){ 
  if(!req.body.lang){
    return res.status(400).json({success: false, msg: "Lang code is required." });
  } 

  var searchTaxi = new SearchTaxi.SearchTaxiSchema({
    source: req.body.source, 
    destination: req.body.destination, 
    source_lat: req.body.source_lat,
    source_long: req.body.source_long,
    destination_lat: req.body.destination_lat, 
    destination_long: req.body.destination_long
  }); 
    
  searchTaxi.validate()
    .then(() =>{ 
      /* var resData = {'taxi_cost':'100','parcel_cost':'100'}; 
      res.json({success: true, data:resData}); */

      var taxi_cost = 0;   
      var parcel_cost = 0;   
      var parcel_message = 0;   
      var taxi_message = 0;   
      var agg_taxi = [ 
        { $match: {
          is_active:1,
          is_deleted: 0,
          is_complete_offer:0,
          source:req.body.source,
          destination:req.body.destination
        }},
        //{ $unwind: "$qty_of_passenger" },
        { $group: {
            _id: null,
            average_taxi_cost: { $avg: "$cost"  }
        }}
      ];

      var agg_parcel = [ 
        { $match: {
          is_active:1,
          is_deleted: 0,
          is_parcel_enable:1,
          is_parcel_full:0,
          source:req.body.source,
          destination:req.body.destination
        }},
        //{ $unwind: "$qty_of_passenger" },
        { $group: {
            _id: null,
            average_parcel_cost: { $avg: "$parcel_cost"  }
        }}
      ];

      /* average cost for parcel */
      Offer.aggregate(agg_parcel, function(err, c) {
        if(err){ 
        }   
        if(c != ''){ 
          c = JSON.stringify(c);
          c = JSON.parse(c); 
          parcel_cost   = c[0]['average_parcel_cost'];  
          parcel_message  = "Valid Parcel cost.";
        }else{ 
          parcel_message  = "Route not found.";
        }

        /* average cost for taxi */
        Offer.aggregate(agg_taxi, function(err, c) {
          if(err){ 
          }   
          if(c != ''){ 
            c = JSON.stringify(c);
            c = JSON.parse(c); 
            taxi_cost  = c[0]['average_taxi_cost'];  
            taxi_message  = "Valid taxi cost.";
          }else{ 
            taxi_message  = "Route not found.";
          }
          
          var resData = {'taxi_cost':taxi_cost.toFixed(0),'parcel_cost':parcel_cost.toFixed(0),'taxi_message':taxi_message,'parcel_message':parcel_message}; 
          res.json({success: true, data:resData}); 
        }); 
      });
   
     }).catch(err => 
       {
        if (err) { 
          var errorMsg	=	"";
          var lang	=	req.body.lang;
            switch (err.name) { 
                case 'ValidationError':
                for (field in err.errors) {
                    switch (err.errors[field].message) {
                    case '':
                        errorMsg	+=	"Something went wrong.,";
                        break;
                    default: 
                       errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                        break; 
                    }
                }
                break;
                case 'MongoError':
                errorMsg	+=	"Duplicate key.";
                default:
                errorMsg	+=	"Something went wrong.,";
            }
        }
        errorMsg.replace(/,+$/,'');
        return res.status(400).json({success: false, msg: errorMsg });
       }
    );  
}

function taxiParcelOfferList(req, res,next){ 
  if(!req.body.lang){
    return res.status(400).json({success: false, msg: "Lang code is required." });
  }
  if(!req.body.type){
    return res.status(400).json({success: false, msg: "Search type is required." });
  }
  if(!req.body.sort_by){
    return res.status(400).json({success: false, msg: "Sort key is required." });
  }
  if(!req.body.user_id){
    return res.status(400).json({success: false, msg: "User id is required." });
  }

  if(req.body.type == "taxi"){ 
    var searchTaxi = new SearchTaxi.OfferTaxiSchema({
      source: req.body.source, 
      destination: req.body.destination, 
      source_lat: req.body.source_lat,
      source_long: req.body.source_long,
      destination_lat: req.body.destination_lat, 
      destination_long: req.body.destination_long,
      qty_of_passenger: req.body.qty_of_passenger
    }); 
    
  searchTaxi.validate()
    .then(() =>{   
      Offer.find({
        is_active:1,
        is_deleted: 0,
        is_complete_offer:0,
        source:req.body.source,
        destination:req.body.destination,
        pending_seat:{ $gte : req.body.qty_of_passenger}
      }).populate({path: 'car_model_id', select: 'name'}) 
      .populate({
        path: 'driver_id',select: 'full_name phone_number'
      }) 
      .sort({cost:req.body.sort_by}).exec(function(err,data) {
          if (err) { 
            return res.status(400).json({success: false, msg: "Something went wrong." });
          }
          async.forEach(data,function(item,callback) {
            Favorite.findOne({passenger_id:req.body.user_id,driver_id:item.driver_id._id},function(err,result){
              item.set('is_favorite',0,{strict:false}); 
              if(result){
                result = JSON.stringify(result);
                result = JSON.parse(result); 
                item.set('is_favorite',result.is_favorite,{strict:false});
              }
              item.set('is_recommended',0,{strict:false});
              item.set('available_seat',item.pending_seat,{strict:false}); 

              
              Offer.countDocuments({driver_id:item.driver_id,is_complete_offer:3}, function(err, c) {
                total_trip  = c;    
                item.set('total_trips',total_trip,{strict:false}); 
                callback(); 
              }); 
            
            })   
          }, function(err) { 
            data = JSON.stringify(data);
            data = JSON.parse(data); 
            var sorto = {is_favorite:"desc",cost:req.body.sort_by};
            data.keySort(sorto); 
            res.json({success: true, data: data});
          });  
      }); 
     }
    ).catch(err => 
       {
        if (err) { 
          var errorMsg	=	"";
          var lang	=	req.body.lang;
            switch (err.name) { 
                case 'ValidationError':
                for (field in err.errors) {
                    switch (err.errors[field].message) {
                    case '':
                        errorMsg	+=	"Something went wrong.,";
                        break;
                    default: 
                       errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                        break; 
                    }
                }
                break;
                case 'MongoError':
                errorMsg	+=	"Duplicate key.";
                default:
                errorMsg	+=	"Something went wrong.,";
            }
        }
        errorMsg.replace(/,+$/,'');
        return res.status(400).json({success: false, msg: errorMsg });
       }
    ); 
  }else{ 
    var searchTaxi = new SearchTaxi.OfferTaxiSchema({
      source: req.body.source, 
      destination: req.body.destination, 
      source_lat: req.body.source_lat,
      source_long: req.body.source_long,
      destination_lat: req.body.destination_lat, 
      destination_long: req.body.destination_long,
      qty_of_passenger: req.body.qty_of_passenger
    }); 
    
  searchTaxi.validate()
    .then(() =>{ 
      Offer.find({is_active:1,
        is_deleted: 0,is_parcel_enable:1,is_parcel_full:0,
        source:req.body.source,
        is_complete_offer:0,
        destination:req.body.destination},function (err, data) {  
        if (err) { 
          return res.status(400).json({success: false, msg: "Something went wrong." });
        } 

        async.forEach(data,function(item,callback) {  
            item.set('total_trips',0,{strict:false});
            item.set('is_recommended',0,{strict:false});
          Offer.countDocuments({driver_id:item.driver_id,is_complete_offer:3}, function(err, c) {
            total_trip  = c;   
            Favorite.findOne({passenger_id:req.body.user_id,driver_id:item.driver_id._id},function(err,result){
              item.set('is_favorite',0,{strict:false}); 
              if(result){
                result = JSON.stringify(result);
                result = JSON.parse(result); 
                item.set('is_favorite',result.is_favorite,{strict:false});
              } 
              item.set('total_trips',total_trip,{strict:false});
              item.set('is_recommended',0,{strict:false});
              callback();
            }) 
          }); 
        }, function(err) { 
          data = JSON.stringify(data);
          data = JSON.parse(data); 
          var sorto = {is_favorite:"desc",parcel_cost:req.body.sort_by};
          data.keySort(sorto); 
          res.json({success: true, data: data});
        });  
 
      }).populate({path: 'car_model_id', select: 'name'}).populate({ path: 'driver_id', select: 'full_name phone_number' }).sort({parcel_cost:req.body.sort_by}); 
     }
    ).catch(err => 
       {
        if (err) { 
          var errorMsg	=	"";
          var lang	=	req.body.lang;
            switch (err.name) { 
                case 'ValidationError':
                for (field in err.errors) {
                    switch (err.errors[field].message) {
                    case '':
                        errorMsg	+=	"Something went wrong.,";
                        break;
                    default: 
                       errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                        break; 
                    }
                }
                break;
                case 'MongoError':
                errorMsg	+=	"Duplicate key.";
                default:
                errorMsg	+=	"Something went wrong.,";
            }
        }
        errorMsg.replace(/,+$/,'');
        return res.status(400).json({success: false, msg: errorMsg });
       }
    ); 
  }
}

function bookTaxi(req, res,next){ 
  if(!req.body.lang){
    return res.status(400).json({success: false, msg: "Lang code is required." });
  }
  if(!req.body.type){
    return res.status(400).json({success: false, msg: "Type is required." });
  }
  if(!req.body.passenger_id){
    return res.status(400).json({success: false, msg: "Passenger id is required." });
  }
  var lang = req.body.lang; 
  if(req.body.type == "taxi"){ 
    BookTaxi.find({passenger_id:req.body.passenger_id,
      is_deleted: 0,status:[0,1],book_type:"taxi"},function (err, data) {  
      if (err) { 
        return;
      }  
      if(data &&  data != ""){
        res.json({success: false,msg: global[lang+"_you_have_already_booked_a_taxi_please_complete_trip"]}); 
      }else{
        var bookTaxi = new BookTaxi({
          offer_id: req.body.offer_id, 
          comment: req.body.comment, 
          book_type: req.body.type,
          qty_of_passenger: req.body.qty_of_passenger,
          passenger_id: req.body.passenger_id,
          source: req.body.source, 
          destination: req.body.destination, 
          source_lat: req.body.source_lat,
          source_long: req.body.source_long,
          destination_lat: req.body.destination_lat, 
          destination_long: req.body.destination_long,
        });  
        bookTaxi.validate()
        .then(() =>{   
            Offer.findOne({
              _id: req.body.offer_id,
              is_active:1 
            }, function(err, data) {  
              if (!data) {
                res.json({success: false,msg: 'Invalid offer id.'});
              } else {  
                
                var per_person_cost = data.cost;
                var amount          = Number(data.cost*req.body.qty_of_passenger,2);
                var driver_id       = data.driver_id;
                
                var saveBookTaxiData = new BookTaxi({
                  offer_id: req.body.offer_id, 
                  comment: req.body.comment, 
                  book_type: req.body.type,
                  qty_of_passenger: req.body.qty_of_passenger,
                  per_person_cost: per_person_cost,
                  amount: amount.toFixed(0),
                  driver_id: driver_id,
                  passenger_id: req.body.passenger_id,
                  source: req.body.source, 
                  destination: req.body.destination, 
                  source_lat: req.body.source_lat,
                  source_long: req.body.source_long,
                  destination_lat: req.body.destination_lat, 
                  destination_long: req.body.destination_long,
                }); 
    
                saveBookTaxiData.save()
                .then(() =>{ 
                  Offer.findById(req.body.offer_id, function(err, data) {
                    if (err) return next(err);
                    // do your updates here    
                    data.pending_seat =  (data.pending_seat - req.body.qty_of_passenger); 
                    /* if(data.pending_seat <= 0){
                      data.is_complete_offer  = 1;
                    } */ 
                    data.save() 
                    .then(() =>    
                      res.json({success: true,msg: global[lang+"_taxi_has_been_booked_successfully"]})
                    ).catch(err => 
                        next(err)
                      );   
                  });  
                }).catch(err =>{
                  { 
                    if (err) { 
                      var errorMsg	=	"";
                      var lang	=	req.body.lang;
                        switch (err.name) { 
                            case 'ValidationError':
                            for (field in err.errors) {
                                switch (err.errors[field].message) {
                                case '':
                                    errorMsg	+=	"Something went wrong.,";
                                    break;
                                default: 
                                   errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                                    break; 
                                }
                            }
                            break;
                            case 'MongoError':
                            errorMsg	+=	"Duplicate key.";
                            default:
                            errorMsg	+=	"Something went wrong.,";
                        }
                    }
                    errorMsg.replace(/,+$/,'');
                    return res.status(400).json({success: false, msg: errorMsg });
                   }
                }); 
              }
            }); 
         }
        ).catch(err => 
           { 
            if (err) { 
              var errorMsg	=	"";
              var lang	=	req.body.lang;
                switch (err.name) { 
                    case 'ValidationError':
                    for (field in err.errors) {
                        switch (err.errors[field].message) {
                        case '':
                            errorMsg	+=	"Something went wrong.,";
                            break;
                        default: 
                           errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                            break; 
                        }
                    }
                    break;
                    case 'MongoError':
                    errorMsg	+=	"Duplicate key.";
                    default:
                    errorMsg	+=	"Something went wrong.,";
                }
            }
            errorMsg.replace(/,+$/,'');
            return res.status(400).json({success: false, msg: errorMsg });
           }
        ); 
      }
    });
  }else{  
    BookTaxi.find({passenger_id:req.body.passenger_id,
      is_deleted: 0,status:[0,1],book_type:"parcel"},function (err, data) {  
      if (err) { 
        return;
      }  
      if(data &&  data != ""){
        res.json({success: false,msg: global[lang+"_you_have_already_booked_a_parcel"]}); 
      }else{
        var bookTaxi = new BookTaxi({
          offer_id: req.body.offer_id, 
          comment: req.body.comment, 
          book_type: req.body.type,
          qty_of_passenger: req.body.qty_of_passenger,
          passenger_id: req.body.passenger_id,
          source: req.body.source, 
          destination: req.body.destination, 
          source_lat: req.body.source_lat,
          source_long: req.body.source_long,
          destination_lat: req.body.destination_lat, 
          destination_long: req.body.destination_long
        });  
        bookTaxi.validate()
        .then(() =>{   
            Offer.findOne({
              _id: req.body.offer_id,
              is_active:1 
            }, function(err, data) {  
              if (!data) {
                res.json({success: false,msg: 'Invalid offer id.'});
              } else {  
                
                var per_person_cost = data.cost;
                var amount          = data.cost;
                var driver_id       = data.driver_id;
                
                var saveBookTaxiData = new BookTaxi({
                  offer_id: req.body.offer_id, 
                  comment: req.body.comment, 
                  book_type: req.body.type,
                  qty_of_passenger: req.body.qty_of_passenger,
                  per_person_cost: per_person_cost,
                  amount: amount.toFixed(0),
                  driver_id: driver_id,
                  passenger_id: req.body.passenger_id,
                  source: req.body.source, 
                  destination: req.body.destination, 
                  source_lat: req.body.source_lat,
                  source_long: req.body.source_long,
                  destination_lat: req.body.destination_lat, 
                  destination_long: req.body.destination_long,
                  status: 0,
                }); 
    
                saveBookTaxiData.save()
                .then(() =>{ 
                  res.json({success: true,msg: global[lang+"_parcel_has_been_booked_successfully"]});
                }).catch(err =>{
                  { 
                    if (err) { 
                      var errorMsg	=	"";
                      var lang	=	req.body.lang;
                        switch (err.name) { 
                            case 'ValidationError':
                            for (field in err.errors) {
                                switch (err.errors[field].message) {
                                case '':
                                    errorMsg	+=	"Something went wrong.,";
                                    break;
                                default: 
                                   errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                                    break; 
                                }
                            }
                            break;
                            case 'MongoError':
                            errorMsg	+=	"Duplicate key.";
                            default:
                            errorMsg	+=	"Something went wrong.,";
                        }
                    }
                    errorMsg.replace(/,+$/,'');
                    return res.status(400).json({success: false, msg: errorMsg });
                   }
                }); 
              }
            }); 
         }
        ).catch(err => 
           { 
            if (err) { 
              var errorMsg	=	"";
              var lang	=	req.body.lang;
                switch (err.name) { 
                    case 'ValidationError':
                    for (field in err.errors) {
                        switch (err.errors[field].message) {
                        case '':
                            errorMsg	+=	"Something went wrong.,";
                            break;
                        default: 
                           errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                            break; 
                        }
                    }
                    break;
                    case 'MongoError':
                    errorMsg	+=	"Duplicate key.";
                    default:
                    errorMsg	+=	"Something went wrong.,";
                }
            }
            errorMsg.replace(/,+$/,'');
            return res.status(400).json({success: false, msg: errorMsg });
           }
        ); 
      }
    });
  }
}

function markAsFullParcel(req, res,next){ 
  if(!req.body.offer_id){
    return res.status(400).json({success: false, msg: "Offer id is required." });
  }else{   
    var lang = req.body.lang;
    Offer.findById(req.body.offer_id, function(err, data) {
      if (err) return next(err);
      // do your updates here    
      data.is_parcel_full =  1;  
      data.save() 
      .then(() =>    
        res.json({success: true,msg: global[lang+"_parcel_space_filled_completely"]})
      ).catch(err => 
          next(err)
        );   
    }); 
  } 
}

function driverCurrentRequest(req, res,next){ 
  if(!req.body.driver_id){
    return res.status(400).json({success: false, msg: "Driver id is required." });
  }else{   
    BookTaxi.find({driver_id:req.body.driver_id,status:[0,1],book_type:"taxi"}, function(err, data) {
      if (err) return next(err);  
      async.forEach(data,function(item,callback) {  
        var passengerData = JSON.stringify(item.passenger_id);
        passengerData = JSON.parse(passengerData);
        if(passengerData && passengerData.profile_image){
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+passengerData.profile_image; 
        }else{
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+'no_image.png';
        }
        item.passenger_id.set('profile_image_path',profile_image_path,{strict:false}); 
        item.set('last_message',item.comment,{strict:false}); 
        item.set('is_seen',0,{strict:false});  

        UserChat.findOne({offer_id:item.offer_id._id, $or:[ {'sender_id':item.passenger_id}, {'receiver_id':item.passenger_id}]},function(error,result){
          if(result){
            if(result.sender_id == req.body.driver_id){
              item.set('is_seen',0,{strict:false}); 
            }else{
              item.set('is_seen',result.is_seen,{strict:false});
            }  
            item.set('last_message',result.message,{strict:false});  
          } 
          callback(); 
        }).sort({createdAt:'desc'}); 

      }, function(err) { 
        res.json({success: true,data:data});
      });   
    }).populate({path: 'offer_id'}).populate({path: 'passenger_id'}).sort({createdAt:'desc'}); 
  }
}

function updatePassengerBookingStatus(req, res,next){
  var errorMsg  = ""; 
  if(!req.body.device_type){
    errorMsg  +=  "device type is required." 
  }
  if(!req.body.device_id){
    errorMsg  +=  "device type is required." 
  }
  if(!req.body.order_id){
    errorMsg  +=  "order id is required." 
  }
  if(!req.body.status){
    errorMsg  +=  "status is required.";
  } 
  if(req.body.status && req.body.status == 1){
    if(!req.body.amount){
      errorMsg  +=  "amount is required." 
    }
  }
  if(!req.body.user_id){ 
      errorMsg  +=  "User id is required."  
  }
  
  if(!req.body.order_id || !req.body.status || (req.body.status && req.body.status == 1 && !req.body.amount) || !(req.body.user_id) || !(req.body.device_type) || !(req.body.device_id)){ 
    return res.status(400).json({success: false, msg: errorMsg });
  }else{   
    var lang = req.body.lang;
    var pre_amount = 0;
    var new_amount = 0;
    BookTaxi.findById(req.body.order_id, function(err, data){
      if (err) return next(err);    
      /* 0 for pending, 1 for comfirmed 2 for cancelled , 3 for completed */ 
      if(data == null)  {
        res.json({success: false,msg: "Order not found.",is_complete_offer:0}); 
      }else{
        var cancel_status = data.status;
        data.status =  req.body.status;  
        if(data){
          pre_amount    = data.amount;
          var offer_id  = data.offer_id;
          if(req.body.status == 1){
            new_amount   = req.body.amount;
            var diff_amt  = Number(new_amount) - Number(pre_amount);
            data.amount  =  req.body.amount; 
            data.per_person_cost  =  req.body.amount/data.qty_of_passenger; 
            
            if(diff_amt > 0){ 
              Offer.findById(offer_id, function(err, offerData){
                if (err) return next(err);   
                if(offerData != null){  
                  var cost  =  (((offerData.qty_of_passenger*offerData.cost)+diff_amt)/offerData.qty_of_passenger); 
                  offerData.cost  = cost.toFixed(0);   
                }
                offerData.save();
              });
            }  
          }
        }
        data.save() 
        .then(() =>{  
            data  = JSON.stringify(data);
            data  = JSON.parse(data); 
            var successMsg  = "";
            var is_complete_offer  = 0;
            if(req.body.status == 1){
              successMsg  +=  data.passenger_id.full_name+"'s "+global[lang+"_request_has_been_accepted"]; 
            }else if(req.body.status == 2){   
              if(cancel_status == 0){
                BookTaxi.findByIdAndRemove(req.body.order_id,function(err,result){ 
                });
              }
              Offer.update({_id:data.offer_id},{ $inc: { pending_seat: data.qty_of_passenger } }, {new: true }, function(err, data){
                if (err) return next(err);    
              });   
              successMsg  +=  data.passenger_id.full_name+"s "+global[lang+"_request_has_been_cancelled"];  
            }else if(req.body.status == 3){
              successMsg  +=  data.passenger_id.full_name+" "+global[lang+"_has_been_dropped_successfully"];  
            }

            
if(req.body.status == 1){  
  var device_id 	  = data.passenger_id.device_id;
  var device_type 	= data.passenger_id.device_type;  
}else if(req.body.status == 2){   
  if(req.body.user_id == data.passenger_id._id){
    var device_id 	  = data.driver_id.device_id;
    var device_type 	= data.driver_id.device_type;  
  }else{
    var device_id 	  = data.passenger_id.device_id;
    var device_type 	= data.passenger_id.device_type; 
  } 
}else if(req.body.status == 3){ 
  var device_id 	  = data.passenger_id.device_id;
  var device_type 	= data.passenger_id.device_type;  
}                  


 
if(device_type == "android"){  
  var serverkey = global.FCM_SERVER_KEY;
  var fcm = new FCM(serverkey);
  var message = {  
    to : device_id,
    data : {
      notification_type : 'booking_status',
      title : "Booking Status",
      body :successMsg
    },
    notification : {
      title : "Booking Status",
      body : successMsg
    }
  } 
  fcm.send(message, function(err,response){ 
   });  
}else if(device_type == "iPhone"){
  const pn = PushNotification({
    apn: {
        cert: fs.readFileSync('./JaipurSabziMandiCert.pem'), 
        key: fs.readFileSync('./JaipurSabziMandiKey.pem'),
        production: false,
        passphrase: '123456'
      }
    }); 
    const data = {
      title: "Booking Status",
      message:successMsg,
      badge: '',
      sound: '',
      payload: {
        param1: 'Eltar',
        param2: 'booking_status',
      }
    };
    pn.pushToAPN(device_id, data);
} 

            
            BookTaxi.findOne({
              offer_id: offer_id, 
              status  : [0,1]
            }, function(err, user) {    
              if(/* !user &&  */user == "" || user == null){
  
                BookTaxi.findOne({
                  offer_id: offer_id, 
                  status  : 3
                }, function(err, user1) {  

                  if(/* !user &&  */user1 == "" || user1 == null){
                    /* Offer.updateOne({_id:offer_id},{is_complete_offer:2},function(err, data){
                      if (err) return next(err);    
                      is_complete_offer = 1;
                    });  */
                    successMsg  = global[lang+"_trip_has_been_cancelled_successfully"] ;
                    res.json({success: true,msg: successMsg,is_complete_offer:is_complete_offer}); 
                  }else{ 
                    Offer.updateOne({_id:offer_id},{is_complete_offer:3},function(err, data){
                      if (err) return next(err);    
                      is_complete_offer = 1;
                      successMsg  =  global[lang+"_trip_has_been_completed_successfully"];
                      res.json({success: true,msg: successMsg,is_complete_offer:is_complete_offer}); 
                    }); 
                  }
                }); 
              }else{
                res.json({success: true,msg: successMsg,is_complete_offer:is_complete_offer}); 
              }
            });  
          }
        ).catch(err => 
          { 
            if (err) { 
              var errorMsg	=	"";
              var lang	=	req.body.lang;
                switch (err.name) { 
                    case 'ValidationError':
                    for (field in err.errors) {
                        switch (err.errors[field].message) {
                        case '':
                            errorMsg	+=	"Something went wrong.,";
                            break;
                        default: 
                           errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                            break; 
                        }
                    }
                    break;
                    case 'MongoError':
                    errorMsg	+=	"Duplicate key.";
                    default:
                    errorMsg	+=	"Something went wrong.,";
                }
            }
            errorMsg.replace(/,+$/,'');
            return res.status(400).json({success: false, msg: errorMsg });
           }
          ); 
      }  
    }).populate({path: 'passenger_id', select: 'full_name device_id device_type'}).populate({path: 'driver_id', select: 'full_name device_id device_type'}); 
  }
}

function driverProfilePassengerEnd(req, res,next){
  var message   = "";
  if(!req.body.passenger_id){
    message +=  "Passenger id is required.,"; 
  } 
  if(!req.body.user_id){
    message +=  "User id is required."; 
  } 
  if(!req.body.passenger_id || !req.body.user_id){
    return res.status(400).json({success: false, msg: message });
  }else{ 
    User.DriverSchema.findOne({
      _id: req.body.user_id, 
    }, function(err, user) {  
      if (!user) {
        res.json({success: false,msg: 'Invalid user id.'}); 
      } else {  
        var total_review  = 0;
        var rating        = 0;
        var total_trip    = 0;
        var is_favorite   = 0;
        
        Feedback.countDocuments({driver_id:req.body.user_id}, function(err, c) {
          total_review  = c; 
          user.set('total_review',total_review,{strict:false}); 

          Offer.countDocuments({driver_id:req.body.user_id,is_complete_offer:3}, function(err, c) {
            total_trip  = c; 
            user.set('total_trip',total_trip,{strict:false}); 

            var agg_taxi1 = [ 
              { $match: {
                is_deleted: 0,  
                driver_id:mongoose.Types.ObjectId(req.body.user_id)
              }}, 
              { $group: {
                  _id: null,  
                  average_rating: { $avg: "$rating"  }
              }}
            ];
            Feedback.aggregate(agg_taxi1, function(err, c1) {   
              user.set('rating',rating,{strict:false});
              user.set('is_recommended',0,{strict:false});

              if(user.profile_image && user.profile_image != ''){ 
                user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+''+user.profile_image,{strict:false});
              }else{ 
                user.set('profile_image_path',global.PROFILE_IMAGE_ROOT_PATH+'no_image.png',{strict:false});
              }

              if(c1 != '' && typeof c1 != undefined){ 
                c1 = JSON.stringify(c1);
                c1 = JSON.parse(c1); 
                rating  = c1[0]['average_rating'];  
                user.set('rating',rating,{strict:false}); 
              }  

              Favorite.findOne({driver_id:req.body.user_id,passenger_id:req.body.passenger_id}, function(error, result) {
                if (error) return;
                user.set('is_favorite',is_favorite,{strict:false}); 
                if(result != null && result.is_favorite){
                  is_favorite = result.is_favorite;
                  user.set('is_favorite',is_favorite,{strict:false}); 
                }
                res.json({success: true,data:user}); 
              }); 

            }); 
          });
        });    
      }
    }).populate({path: 'car_model_id', select: 'name'});
  }
}

function updateStatusAllOrders(req, res,next){
  var errorMsg  = ""; 
  if(!req.body.driver_id){
    errorMsg  +=  "Driver id is required." 
  }
  if(!req.body.offer_id){
    errorMsg  +=  "Offer id is required." 
  }
  if(!req.body.status){
    errorMsg  +=  "Status is required." 
  }
  if(!req.body.driver_id || !req.body.offer_id || !req.body.status){
    return res.status(400).json({success: false, msg: errorMsg });
  }else{   
    var successMsg  = ""; 
    var lang = req.body.lang;
    BookTaxi.update({driver_id:req.body.driver_id,offer_id:req.body.offer_id},{status:req.body.status},{ multi: true }, function(err, data){
      if (err) return next(err);  
    }); 

    Offer.update({_id:req.body.offer_id},{is_complete_offer:req.body.status},{ multi: true }, function(err, data){
      if (err) return next(err); 
        var successMsg  = "";
        if(req.body.status == 2){ 
          if(req.body.offer_id){
            Offer.update({_id:req.body.offer_id},{ $inc: { pending_seat: 1 } }, {new: true }, function(err, data){
              if (err) return next(err);    
            }); 
          }
          successMsg  += global[lang+"_your_booking_has_been_cancelled_successfully"];
        }else if(req.body.status == 3){
          successMsg  +=  global[lang+"_your_booking_has_been_completed_successfully"];
        }else if(req.body.status == 1){
          successMsg  +=  global[lang+"_your_booking_has_been_started_successfully"];
        }

        Offer.findOne({
          _id: req.body.offer_id, 
        }, function(err, user) {  
          res.json({success: true,msg: successMsg,is_complete_offer:user.is_complete_offer}); 
        });
    }); 
  }
}

function passengerCurrentRequest(req, res,next){ 
  if(!req.body.passenger_id){
    return res.status(400).json({success: false, msg: "Passenger id is required." });
  }else{   
    BookTaxi.find({passenger_id:req.body.passenger_id,status:[0,1],book_type:"taxi"}, function(err, data) {
      if (err) return next(err);   

      async.forEach(data,function(item,callback) {  
        var offerData = JSON.stringify(item);
        offerData = JSON.parse(offerData);
        if(offerData && (offerData.driver_id.profile_image)){
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+offerData.driver_id.profile_image; 
        }else{
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+'no_image.png';
        }
        item.driver_id.set('profile_image_path',profile_image_path,{strict:false}); 

        item.set('last_message',"",{strict:false});  
        item.set('is_seen',0,{strict:false});  
        UserChat.findOne({offer_id:offerData.offer_id,$or:[ {'sender_id':req.body.passenger_id}, {'receiver_id':req.body.passenger_id}]},function(error,result){ 
          if(result){
            if(result.sender_id == req.body.passenger_id){
              item.set('is_seen',0,{strict:false}); 
            }else{
              item.set('is_seen',result.is_seen,{strict:false});
            }  
            item.set('last_message',result.message,{strict:false}); 
          }
          callback(); 
        }).sort({createdAt:'desc'});
 
      }, function(err) { 
        res.json({success: true,data:data});
      }); 
    }).populate({path: 'driver_id',select:'full_name profile_image'})/* .populate({path: 'passenger_id'}) */.sort({createdAt:'desc'}); 
  } 
}

function driverTrips(req, res,next){ 
  if(!req.body.driver_id){
    return res.status(400).json({success: false, msg: "Driver id is required." });
  }else{   
    Offer.find({driver_id:req.body.driver_id,is_complete_offer:[2,3]},function(err,data){
      if (err) return next(err);  
      async.forEach(data,function(item,callback) {  
        var offerData = JSON.stringify(item);
        offerData = JSON.parse(offerData);
        var total_taxi_amount   = ((offerData.qty_of_passenger-offerData.pending_seat)*offerData.cost);
        var total_parcel_amount =  offerData.parcel_cost; 
        if(offerData.is_parcel_full == 1){
          var total_amount =  Number(total_taxi_amount+total_parcel_amount).toFixed(0); 
        }else{
          var total_amount =  Number(total_taxi_amount).toFixed(0); 
        }
        item.set('total_taxi_amount',total_taxi_amount,{strict:false}); 
        item.set('total_parcel_amount',total_parcel_amount,{strict:false}); 
        item.set('total_trip_amount',total_amount,{strict:false}); 
          callback(); 
      }, function(err) { 
        res.json({success: true,data:data});
      });
    }).populate({path: 'car_model_id',select: 'name'}).sort({createdAt:'desc'}); 
  } 
}

function passengerTrips(req, res,next){
  if(!req.body.passenger_id){
    return res.status(400).json({success: false, msg: "Passenger id is required." });
  }else{   
    BookTaxi.find({passenger_id:req.body.passenger_id,status:[2,3]}, function(err, data) {
      if (err) return next(err);     
      res.json({success: true,data:data});
    }).populate({
      path: 'offer_id',select: 'car_number car_model_id',
      populate: {
        path: 'car_model_id',
        model: 'CarModel',
        select: "name"
      }
    }).populate({path: 'driver_id',select: 'full_name'}).sort({createdAt:'desc'}); 
  } 
}

function driverTripsDetail(req, res,next){
  if(!req.body.offer_id){
    return res.status(400).json({success: false, msg: "Offer id is required." });
  }else{   
    Offer.findOne({
      _id: req.body.offer_id
    }, function(err, data) {  
      if (!data) {
        res.json({success: false,msg: 'Invalid offer id.'});
      } else { 
        var offerData = JSON.stringify(data);
        offerData = JSON.parse(offerData);
        var total_taxi_amount   = ((offerData.qty_of_passenger-offerData.pending_seat)*offerData.cost);
        var total_parcel_amount =  offerData.parcel_cost; 
        if(offerData.is_parcel_full == 1){
          var total_amount =  Number(total_taxi_amount+total_parcel_amount).toFixed(0); 
        }else{
          var total_amount =  Number(total_taxi_amount).toFixed(0); 
        } 
        data.set('total_taxi_amount',total_taxi_amount,{strict:false}); 
        data.set('total_parcel_amount',total_parcel_amount,{strict:false}); 
        data.set('total_trip_amount',total_amount,{strict:false}); 

        BookTaxi.find({driver_id:req.body.driver_id,offer_id:req.body.offer_id,status:[1,2,3]}, function(err, orderData) {
          if (err) return next(err);  
          async.forEach(orderData,function(item,callback) {  
            var passengerData = JSON.stringify(item.passenger_id);
            passengerData = JSON.parse(passengerData);
            if(passengerData && passengerData != ''){
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
  } 
}

function passengerTripDetail(req, res,next){
  if(!req.body.order_id){
    return res.status(400).json({success: false, msg: "Order id is required." });
  }else{   
    BookTaxi.findOne({_id:req.body.order_id}, function(err, data) {
      if (err) return next(err);  
      if(data){ 
  
        var driverData  = JSON.stringify(data.driver_id);
        driverData      = JSON.parse(driverData);
        if(driverData && driverData != '' && driverData.profile_image){
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+driverData.profile_image; 
        }else{
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+'no_image.png';
        }
        data.driver_id.set('profile_image_path',profile_image_path,{strict:false});  
        res.json({success: true,data:data});  
      }else{
        res.json({success: false,data:data});  
      } 
    }).populate({
        path: 'offer_id',select: 'car_number car_model_id',
        populate: {
          path: 'car_model_id',
          model: 'CarModel',
          select: "name"
        }
      })
    .populate({path: 'car_model_id',select: 'name'})
    .populate({path: 'driver_id',select: 'full_name phone_number profile_image'})
    .sort({createdAt:'desc'});
  } 
}

function submitDriverFeedback(req, res,next){
  var FeedbackData = new Feedback({
    order_id: req.body.order_id, 
    passenger_id: req.body.passenger_id, 
    driver_id: req.body.driver_id, 
    offer_id: req.body.offer_id,
    rating: req.body.rating,
    comment: (req.body.comment)?req.body.comment:''
  }); 
  var lang = req.body.lang;
  FeedbackData.save()
  .then(() => {
      BookTaxi.updateOne({_id:req.body.order_id},{is_feedback:1}, function(err, data){
        if (err) return next(err);  
        res.json({success: true, msg:global[lang+"_feedback_submitted_successfully"]})
      }); 
    }
  )
  .catch(err => 
    { 
      if (err) { 
        var errorMsg	=	"";
        var lang	=	req.body.lang;
          switch (err.name) { 
              case 'ValidationError':
              for (field in err.errors) {
                  switch (err.errors[field].message) {
                  case '':
                      errorMsg	+=	"Something went wrong.,";
                      break;
                  default: 
                     errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                      break; 
                  }
              }
              break;
              case 'MongoError':
              errorMsg	+=	"Duplicate key.";
              default:
              errorMsg	+=	"Something went wrong.,";
          }
      }
      errorMsg.replace(/,+$/,'');
      return res.status(400).json({success: false, msg: errorMsg });
     }
    ); 
}

function driverFeedbackList(req, res,next){
  if(!req.body.driver_id){
    return res.status(400).json({success: false, msg: "Driver id is required." });
  }else{ 
    Feedback.find({driver_id:req.body.driver_id}, function(err, orderData) {
      if (err) return next(err);  
      async.forEach(orderData,function(item,callback) {  
        var passengerData = JSON.stringify(item.passenger_id);
        passengerData = JSON.parse(passengerData);
        if(passengerData && passengerData != ''){
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+passengerData.profile_image; 
        }else{
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+'no_image.png';
        }
        item.passenger_id.set('profile_image_path',profile_image_path,{strict:false}); 
          callback(); 
      }, function(err) { 
        res.json({success: true,data:orderData});
      });    
    }).populate({path: 'passenger_id'}).sort({createdAt:'desc'});  
  } 
}

function sendNotification(req, res,next){  
  var device_id 	= (typeof req.query.device_id !== 'undefined' && req.query.device_id !== null) ? req.query.device_id : '';
  var device_type 	= (typeof req.query.device_type !== 'undefined' && req.query.device_type !== null) ? req.query.device_type : '';
  console.log(device_id)
  if(device_type == "andriod"){
    var serverkey = global.FCM_SERVER_KEY;  
  }else if(device_type == "iphone"){
    //var serverkey = require('../../ck_sabzimandidev'); 
    var serverkey = fs.readFileSync('../../ck_sabzimandidev.pem'); 
  }else{
    var serverkey = '';
  }
  
  var fcm = new FCM(serverkey);
  var message = {  
    to : device_id,
    data : {
      value1 : 'value1',
      value2 : 'value2'
    },
    notification : {
      title : 'Eltar Notification Title',
      body : 'Eltar Notification Body'
    }
  }
  
  fcm.send(message, function(err,response){  
    console.log(err);
    if(err) {
      //con.release();
      res.send({
        status	: global.STATUS_ERROR,
        message	: 'Something has gone wrong !'
      });
      //console.log("Something has gone wrong !");
    } else {
      //console.log("Successfully sent with resposne :",response);
      //con.release();
      res.send({
        status	: global.STATUS_SUCCESS,
        message	: "Successfully sent with resposne",
        data	: response
      });
    }
  });
}

function sendIOSNotification(req, res,next){  

  
const pn = PushNotification({
  apn: {
      cert: path.resolve('http://eltar.stage02.obdemo.com/uploads/JaipurSabziMandiCert.pem'),
      key: path.resolve('http://eltar.stage02.obdemo.com/uploads/JaipurSabziMandiKey.pem'), 
      production: false,
    },
    gcm: {
        apiKey: 'gcm-api-key'
    }
  });

  const data = {
    title: 'Title',
    message: 'Message',
    badge: '',
    sound: '',
    payload: {
        param1: 'additional data',
        param2: 'another data'
    }
  };
  pn.pushToAPN(req.query.device_id, data);
 /*  var options = {
    keyFile : "http://eltar.stage02.obdemo.com/uploads/JaipurSabziMandiKey.pem",
    certFile : "http://eltar.stage02.obdemo.com/uploads/JaipurSabziMandiCert.pem",
    debug : true
 };
  
 var connection = new apns.Connection(options);
  
 var notification = new apns.Notification();
 notification.payload = {"description" : "A good news !"};
 notification.badge = 1;
 notification.sound = "dong.aiff";
 notification.alert = "Hello World !";
 notification.device = new apns.Device(req.query.device_id);
 notification.alert = "Hello World !";
  
 connection.sendNotification(notification); */
}

function saveUserChat(req, res,next){
  var errorMsg = '';
  if(!req.body.lang){
    errorMsg  +=  'lang is required.';
  }  
  if(!req.body.lang){
    res.json({success: false,msg: errorMsg});
  } 
  var userChat = new UserChat({
    offer_id: req.body.offer_id, 
    sender_id: req.body.sender_id, 
    receiver_id: req.body.receiver_id, 
    message: req.body.message
  });  
  var lang = req.body.lang;
  userChat.save()
  .then(() => { 

    SingleUser.findById(req.body.receiver_id,function(err,result){
      if(result){
        var sender_name = "";
        SingleUser.findById(req.body.sender_id,function(err,senderData){
          if(senderData){
            senderData  = JSON.stringify(senderData);
            senderData  = JSON.parse(senderData);
            sender_name = senderData.full_name+" "+global[lang+"_sent_you_message"];
          }
          result  = JSON.stringify(result);
          result  = JSON.parse(result);
          var device_id 	= (typeof result.device_id !== 'undefined' && result.device_id !== null) ? result.device_id : '';
          var device_type 	= (typeof result.device_type !== 'undefined' && result.device_type !== null) ? result.device_type : '';  
          
          if(device_type == "android"){ 
            console.log(device_id)
            var serverkey = global.FCM_SERVER_KEY;
            var fcm = new FCM(serverkey);
            var message = {  
              to : device_id,
              data : {
                notification_type : 'inbox',
                title : sender_name,
                body : req.body.message 
              },
              notification : {
                title : sender_name,
                body : req.body.message
              }
            }
            
            fcm.send(message, function(err,response){   
              if(!err){ 
                 res.json({success: true,response:response, msg: global[lang+"_message_saved_successfully"]})
              }else{ 
                 res.json({success: true, msg:global[lang+"_message_saved_successfully"]})
              }
            });  
          }else if(device_type == "iPhone"){
            const pn = PushNotification({
              apn: {
                  cert: fs.readFileSync('./JaipurSabziMandiCert.pem'), 
                  key: fs.readFileSync('./JaipurSabziMandiKey.pem'),
                  production: false,
                  passphrase: '123456'
                }
              }); 
              const data = {
                title: sender_name,
                message:req.body.message,
                badge: '',
                sound: '',
                payload: {
                  param1: 'Eltar'
                }
              };
              pn.pushToAPN(device_id, data)
              .then(res =>res.json({success: true,response:response, msg:global[lang+"_message_saved_successfully"]}))
              .catch(err =>res.json({success: true, msg:global[lang+"_message_saved_successfully"]}));
          }else{ 
            res.json({success: true, msg:global[lang+"_message_saved_successfully"]})
          }
        });  
      }
    });  
    }
  )
  .catch(err =>  
    { 
      console.log(err)
      if (err) { 
        var errorMsg	=	"";
        var lang	=	req.body.lang;
          switch (err.name) { 
              case 'ValidationError':
              for (field in err.errors) {
                  switch (err.errors[field].message) {
                  case '':
                      errorMsg	+=	"Something went wrong.,";
                      break;
                  default: 
                     errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                      break; 
                  }
              }
              break;
              case 'MongoError':
              errorMsg	+=	"Duplicate key.";
              default:
              errorMsg	+=	"Something went wrong.,";
          }
      }
      errorMsg.replace(/,+$/,'');
      return res.status(400).json({success: false, msg: errorMsg });
     }
  ); 
}

function offerUserChat(req, res,next){ 
  if(!req.body.offer_id){
    return res.status(400).json({success: false, msg: "Offer id is required." });
  }else if(!req.body.user_id){
    return res.status(400).json({success: false, msg: "User id is required." });
  }else{   
    UserChat.find({offer_id:req.body.offer_id,$or:[ {'sender_id':req.body.user_id}, {'receiver_id':req.body.user_id}]}, function(err, data) {
      if (err) return next(err);  

      var query = {
        offer_id:req.body.offer_id,
        $or:[ {'sender_id':req.body.user_id}, {'receiver_id':req.body.user_id}]
      },
      update = {  
        is_seen:0
      },
      options = { multi: true };
      UserChat.updateMany(query, update, options, function(error, result) {
        if (error) return;  
      }); 
      async.forEach(data,function(item,callback) {  
        var itemData      = JSON.stringify(item);
        itemData          = JSON.parse(itemData);
        var senderIdData  = itemData.sender_id;
        var receiveIdData = itemData.receiver_id;
        if(senderIdData.profile_image && senderIdData.profile_image != ''){
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+senderIdData.profile_image; 
        }else{
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+'no_image.png';
        }
        item.sender_id.set('profile_image_path',profile_image_path,{strict:false}); 
        if(receiveIdData.profile_image && receiveIdData.profile_image != ''){
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+''+receiveIdData.profile_image; 
        }else{
          var profile_image_path = global.PROFILE_IMAGE_ROOT_PATH+'no_image.png';
        }
        item.receiver_id.set('profile_image_path',profile_image_path,{strict:false}); 
          callback(); 
      }, function(err) { 
        res.json({success: true,data:data});
      });   
    }).populate({path: 'sender_id',select:"profile_image full_name"}).populate({path: 'receiver_id',select:"profile_image full_name"}).sort({createdAt:'asc'}); 
  } 
}

function markFavoriteDriver(req, res,next){ 
  var favoriteData = new Favorite({
    passenger_id: req.body.passenger_id, 
    driver_id: req.body.driver_id, 
    is_favorite: req.body.is_favorite
  }); 
  var lang = req.body.lang;
  favoriteData.validate()
    .then(() =>{ 
      var query = {
        passenger_id: req.body.passenger_id, 
        driver_id: req.body.driver_id, 
      },
      update = { 
        passenger_id: req.body.passenger_id, 
        driver_id: req.body.driver_id, 
        is_favorite: req.body.is_favorite
      },
      options = { upsert: true, new: true, setDefaultsOnInsert: true };
      Favorite.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return;
        if(req.body.is_favorite == 0){
          var message =global[lang+"_mark_as_unfavorite_successfully"];
        }else{
          var message =global[lang+"_mark_as_favorite_successfully"];
        }
        res.json({success: true, msg:message});   
      }); 
     }).catch(err => 
       {
        if (err) { 
          var errorMsg	=	"";
          var lang	=	req.body.lang;
            switch (err.name) { 
                case 'ValidationError':
                for (field in err.errors) {
                    switch (err.errors[field].message) {
                    case '':
                        errorMsg	+=	"Something went wrong.,";
                        break;
                    default: 
                       errorMsg	+=	global[lang+"_"+err.errors[field].message]+",";  
                        break; 
                    }
                }
                break;
                case 'MongoError':
                errorMsg	+=	"Duplicate key.";
                default:
                errorMsg	+=	"Something went wrong.,";
            }
        }
        errorMsg.replace(/,+$/,'');
        return res.status(400).json({success: false, msg: errorMsg });
       }
    );  
}






  