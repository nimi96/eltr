var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var UserChatSchema = new Schema({  
    sender_id : { 
        type: Schema.Types.ObjectId, ref: 'User', 
        required: [true,"sender_id_is_required"]  
    }, 
    receiver_id : { 
        type: Schema.Types.ObjectId, ref: 'User', 
        required: [true,"receive_id_is_required"]  
    }, 
    offer_id : { 
        type: Schema.Types.ObjectId, ref: 'Offer', 
        required: [true,"offer_id_is_required"]  
    }, 
    message : { 
        type: String,
        required: [true,"message_is_required"]  
    }, 
    is_seen : { 
        type: Number,
        default:1
    },  
    createdAt: Date,
    updatedAt: Date
},{
    collection: 'userchats'
});

UserChatSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
        this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});

UserChatSchema.plugin(mongooseDateFormat);

module.exports = mongoose.model('UserChat',UserChatSchema);