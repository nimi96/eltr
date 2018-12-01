var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format'); 

var adminLanguageSchema = new Schema({ 
    key_value: {
          type: String, 
          required: [true,"Car model and color is required"] 
      },
    lang_code: {
          type: String,
          required: [true,"Qty of passenger is required"]
      },  
    value: {
          type: String,
          required: [true,"Qty of passenger is required"]
      },  
    createdAt: Date,
    updatedAt: Date
},{
    collection: 'textsettings'
});
  
adminLanguageSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});
    
adminLanguageSchema.plugin(mongooseDateFormat); 

module.exports = mongoose.model('AdminLanguageSetting', adminLanguageSchema);