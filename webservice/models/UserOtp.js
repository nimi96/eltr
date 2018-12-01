var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var UserOtpSchema = new Schema({  
    phone_number : { 
        type:String,
        required: [true,"phone_number_is_required"]  
    }, 
    otp: {
        type: String,
        default:0
    },
    createdAt: Date,
    updatedAt: Date
},{
    collection: 'userotp'
});

UserOtpSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
        this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});

UserOtpSchema.plugin(mongooseDateFormat);

module.exports = mongoose.model('UserOtp',UserOtpSchema);