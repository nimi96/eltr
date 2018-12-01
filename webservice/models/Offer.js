var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var OfferSchema = new Schema({ 
    source: {
        type: String,
        required: [true,"source_is_required"] 
    },
    destination: {
        type: String, 
        required: [true,"destination_is_required"] , 
        validate: {
            validator: function (value) { 
                if(value == this.source){ 
                        return false; 
                }else{
                    return true;
                } 
            },
            message: 'source_and_destination_must_be_different'
        }
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
    qty_of_passenger: {
        type: Number, 
        required: [true,"qty_of_passenger_is_required"] 
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
        required: [true,"cost_is_required"] 
    },
    driver_id : { 
        type: Schema.Types.ObjectId, ref: 'User', 
        required: [true,"driver_id_is_required"]  
    }, 
    is_parcel_enable: { 
        type: Number, 
        required: [true,"parcel_status_is_required"] 
    },
    parcel_cost: { 
        type: Number, 
        required: [false,"parcel_cost_is_required"], 
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
            message: 'parcel_cost_is_required'
        } 
    }, 
    car_number: { 
        type: String, 
        required: [true,"car_number_is_required"] 
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

OfferSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});

OfferSchema.plugin(mongooseDateFormat);

module.exports = mongoose.model('Offer', OfferSchema);