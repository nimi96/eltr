var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var AdminOffer = new Schema({ 
    source: {
        type: String,
        required: [true,"Source is required"] 
    },
    destination: {
        type: String, 
        required: [true,"Destination is required"] 
    },
    source_lat: {
        type: String, 
        required: [true,"Source latitude is required"] 
    },
    source_long: {
        type: String, 
        required: [true,"Source longitude is required"] 
    },
    destination_lat: {
        type: String, 
        required: [true,"Destination latitude is required"] 
    },
    destination_long: {
        type: String, 
        required: [true,"Destination longitude is required"] 
    },
    qty_of_passenger: {
        type: Number, 
        required: [true,"Qty of passenger is required"] 
    },
    pending_seat: {
        type: Number,  
    },
    is_complete_offer: {
        type: Number,
        default:0  
    },
    is_parcel_full: {
        type: Number,
        default:0  
    },
    cost: { 
        type: Number, 
        required: [true,"Cost is required"] 
    },
    driver_id : { 
        type: Schema.Types.ObjectId, ref: 'User', 
        required: [true,"Driver id is required"]  
    }, 
    is_parcel_enable: { 
        type: Number, 
        required: [true,"Parcel status is required"] 
    },
    parcel_cost: { 
        type: Number, 
        required: [false,"Parcel cost is required"], 
        validate: {
            validator: function (value) { 
                if(1 == this.is_parcel_enable){
                    if(value != 0){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return true;
                } 
            },
            message: 'Parcel cost is required'
        } 
    }, 
    car_number: { 
        type: String, 
        required: [true,"Car number is required"] 
    },
    car_model_id : { type: Schema.Types.ObjectId, ref: 'CarModel', required: [true,"Car model id is required"]  },
    is_active: {
        type: Number,
        default:1
    }, 
    is_deleted: {
        type: Number,
        default:0
    },
    createdAt: Date,
    updatedAt: Date
},{
    collection: 'offers'
});


AdminOffer.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});

AdminOffer.plugin(mongooseDateFormat); 

module.exports = mongoose.model('AdminOffer', AdminOffer);