var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var FavoriteSchema = new Schema({  
    passenger_id : { 
        type: Schema.Types.ObjectId, ref: 'User', 
        required: [true,"passenger_id_is_required"]  
    }, 
    driver_id : { 
        type: Schema.Types.ObjectId, ref: 'User', 
        required: [true,"driver_id_is_required"]  
    },  
    is_favorite: {
        type: Number, 
        required: [true,"favorite_is_required"]  
    },
    createdAt: Date,
    updatedAt: Date
},{
    collection: 'favorites'
});

FavoriteSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
        this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});

FavoriteSchema.plugin(mongooseDateFormat);

module.exports = mongoose.model('Favorite',FavoriteSchema);