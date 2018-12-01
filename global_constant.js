
/* global.WEBSITE_ROOT_PATH				= __dirname + '/../app/';
global.WEBSITE_APP_WEBROOT_ROOT_PATH 	= global.WEBSITE_ROOT_PATH + 'webroot/';
global.APP_UPLOADS_ROOT_PATH			= global.WEBSITE_APP_WEBROOT_ROOT_PATH + 'uploads/';
global.USER_FILE_PATH					= global.APP_UPLOADS_ROOT_PATH+'orders/'; */

global.WEBSITE_ROOT_PATH				= __dirname+'/'; 
//global.BASEURL                          = "http://eltar.stage02.obdemo.com/";
global.BASEURL                          = "http://localhost:3000/";
//global.APP_UPLOADS_ROOT_PATH			= global.WEBSITE_ROOT_PATH + 'src/assets/uploads/';
global.APP_UPLOADS_ROOT_PATH			= global.WEBSITE_ROOT_PATH + 'uploads/'; 
global.APP_IMAGE_ROOT_PATH			    = global.BASEURL + 'uploads/'; 
global.PROFILE_UPLOADS_ROOT_PATH        = global.APP_UPLOADS_ROOT_PATH + 'profile/'; 
global.DOCUMENT_UPLOADS_ROOT_PATH       = global.APP_UPLOADS_ROOT_PATH + 'document/'; 
global.LICENCE_UPLOADS_ROOT_PATH        = global.APP_UPLOADS_ROOT_PATH + 'licence/'; 
global.PROFILE_IMAGE_ROOT_PATH          = global.APP_IMAGE_ROOT_PATH + 'profile/'; 
global.DOCUMENT_IMAGE_ROOT_PATH         = global.APP_IMAGE_ROOT_PATH + 'document/'; 
global.LICENCE_IMAGE_ROOT_PATH          = global.APP_IMAGE_ROOT_PATH + 'licence/'; 

global.ADMIN_PER_PAGE_RECORD 	= 10;
global.USER_ROLE_ID 	= 2;
global.ACTIVE 			= 1;
global.USER_DELETED 	= 1;
global.COMPLETED 		= 4;
global.USER_NOT_DELETED = 0;  
global.STATUS_SUCCESS 	= 'success';
global.STATUS_ERROR 	= 'error';
global.STATUS_LOGIN 	= 'login';
global.STATUS_VERIFY 	= 'verify';

global.ALLOWED_IMAGE_EXTENSIONS 		= ['jpg','jpeg','png','gif'];
global.ALLOWED_IMAGE_MIME_EXTENSIONS 	= ['image/jpg','image/jpeg','image/png','image/gif'];
 
global.USERSETTINGS = [
    {"name":"pn"},
    {"name":"sms"}
];

global.FCM_SERVER_KEY                   =   "AAAA80Xkcmg:APA91bHjAjoxHrHob10tD2MR4fsMuULOFk1S0Wi2FbgBOMjoiawHbvc9GVOeKAeVm8STJv1bmdcF0Z_AMbMqWWTCVzTe-_izey6rQJKafKS2nffqJnSIrFcLl7VaT_FcpsO1O41hhKA5";
/*const settings = {
    gcm: {
        id: null,
    },
    apn: {
        token: {
            key: './certs/key.pem', // optionally: fs.readFileSync('./certs/key.pem') 
            keyId: 'ABCD',
            teamId: 'EFGH',
        },
    }
};
const PushNotifications = new require('node-pushnotifications');
const push = new PushNotifications(settings);*/