var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var searchTaxiSchema = new Schema({ 
    source: {
        type: String,
        required: [true,"source_is_required"] 
    },
    destination: {
        type: String, 
        required: [true,"destination_is_required"], 
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
    } 
},{
    collection: 'searchataxi'
});

var offerTaxiSchema = new Schema({ 
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
    qty_of_passenger: {
        type: String, 
        required: [true,"qty_of_passenger_is_required"] 
    } 
},{
    collection: 'searchataxi'
});

searchTaxiSchema.pre('save', function (next) { 
});

searchTaxiSchema.plugin(mongooseDateFormat);
offerTaxiSchema.plugin(mongooseDateFormat);
 

var SearchTaxiSchema = mongoose.model('SearchTaxiSchema',searchTaxiSchema);
var OfferTaxiSchema = mongoose.model('OfferTaxiSchema',offerTaxiSchema);

module.exports = {
    SearchTaxiSchema: SearchTaxiSchema,
    OfferTaxiSchema: OfferTaxiSchema 
};