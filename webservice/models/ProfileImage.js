var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var ProfileImage = new Schema({ 
    image: {  
        data: Buffer,
        contentType: String
    }
},{
    collection: 'users'
});
  
module.exports = mongoose.model('ProfileImage', ProfileImage);