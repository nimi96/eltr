var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');
var mongoosePaginate = require('mongoose-paginate');

var adminCarModelSchema = new Schema({ 
    name: {
          type: String,
          unique: [true,"Car model and color must be unique."],
          required: [true,"Car model and color is required"] 
      },
    qty_of_passenger: {
          type: String,
          required: [true,"Qty of passenger is required"]
      }, 
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
    collection: 'carmodels'
});
  
adminCarModelSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});
    
adminCarModelSchema.plugin(mongooseDateFormat);
adminCarModelSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('AdminCarModel', adminCarModelSchema);