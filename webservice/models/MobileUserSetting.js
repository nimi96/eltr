var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var MobileUserSetting = new Schema({ 
    user_id: { 
        type: Schema.Types.ObjectId, ref: 'MobileUser', 
        required: [true,"user_id_is_required"]  
    },
    name: {
        type: String, 
        required: [true,"name_is_required"] 
    },
    status: {
        type: Number, 
        required: [true,"status_is_required"],
        default:1 
    }, 
    is_deleted: {
        type: Number,
        default:0
    },
    createdAt: Date,
    updatedAt: Date
},{
    collection: 'usersettings'
});

MobileUserSetting.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});
 
MobileUserSetting.plugin(mongooseDateFormat);

module.exports = mongoose.model('MobileUserSetting', MobileUserSetting);