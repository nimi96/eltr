var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var bookTaxiSchema = new Schema({ 
    offer_id: { type: Schema.Types.ObjectId, ref: 'Offer', required: [true,"offer id is required"]  },
    source: {
        type: String,
        required: [true,"source_is_required"] 
    },
    destination: {
        type: String, 
        required: [true,"destination_is_required"] 
    },
    source_lat: {
        type: String, 
        required: [true,"source_latitude_is_required"] 
    },
    source_long: {
        type: String, 
        required: [true,"source_longitude_is_required"] 
    },
    destination_lat: {
        type: String, 
        required: [true,"destination_latitude_is_required"] 
    },
    destination_long: {
        type: String, 
        required: [true,"destination_longitude_is_required"] 
    },
    comment: {
        type: String 
    }, 
    per_person_cost: {
        type: Number 
    }, 
    amount: {
        type: Number 
    }, 
    driver_id: { type: Schema.Types.ObjectId, ref: 'User', required: [false,"driver_id_is_required"]  },
    passenger_id: { type: Schema.Types.ObjectId, ref: 'User', required: [true,"passenger_id_is_required"]  },
    book_type: {
        type: String,
        enum: ['parcel', 'taxi']
    }, 
    qty_of_passenger: {
        type: Number, 
        required: [true,"qty_of_passenger_is_required"] 
    }, 
    is_deleted: {
        type: Number,
        default:0
    },
    is_feedback: {
        type: Number,
        default:0
    },
    status: {
        type: Number,
        default:0 /* 0 for pending, 1 for comfirmed 2 for cancelled , 3 for completed */
    },
    createdAt: Date,
    updatedAt: Date 
},{
    collection: 'orders'
}); 

bookTaxiSchema.pre('save', function (next) { 
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});

bookTaxiSchema.plugin(mongooseDateFormat);  

module.exports  = mongoose.model('BookTaxi',bookTaxiSchema); 