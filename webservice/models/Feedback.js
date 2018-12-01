var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var FeedbackSchema = new Schema({  
    passenger_id : { 
        type: Schema.Types.ObjectId, ref: 'User', 
        required: [true,"passenger_id_is_required"]  
    }, 
    driver_id : { 
        type: Schema.Types.ObjectId, ref: 'User', 
        required: [true,"driver_id_is_required"]  
    }, 
    offer_id : { 
        type: Schema.Types.ObjectId, ref: 'Offer', 
        required: [true,"offer_id_is_required"]  
    }, 
    order_id : { 
        type: Schema.Types.ObjectId, ref: 'BookTaxi', 
        required: [true,"order_id_is_required"]  
    }, 
    rating : { 
        type: Number
    }, 
    comment : { 
        type: String
    }, 
    is_deleted: {
        type: Number,
        default:0
    },
    createdAt: Date,
    updatedAt: Date
},{
    collection: 'feedbacks'
});

FeedbackSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
        this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});

FeedbackSchema.plugin(mongooseDateFormat);

module.exports = mongoose.model('Feedback',FeedbackSchema);