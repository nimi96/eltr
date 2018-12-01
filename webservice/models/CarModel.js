var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var CarSchema = new Schema({ 
},{
    collection: 'carmodels'
});
  
module.exports = mongoose.model('CarModel', CarSchema);