var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');
var uniqueValidator = require('mongoose-unique-validator');

var DriverSchema = new Schema({
    full_name: {
        type: String,
        required: [true,"Full name is required"] 
      },
    phone_number: {
        type: String,
        index: true,
        unique: [true,"Phone number must be unique"],
        required: [true,"Phone number is required"] 
    },
    car_model_id : { type: Schema.Types.ObjectId, ref: 'AdminCarModel', required: [true,"Car model id is required"]  },
    qty_of_passenger: {
        type: String, 
        required: [true,"Qty of passenger is required"] 
    },
    car_number: {
        type: String, 
        required: [true,"Car number is required"] 
    },
    profile_image: {
        type: String
    },
    driving_licence: {
        type: String
    },
    document: {
        type: String
    },
    doc_title: {
        type: String
    },
    user_role_id: {
        type: String, 
        required: [true,"User role is required"], 
        validate: {
            validator: function (value) {
                return value == 3; 
            },
            message: 'User role must be driver'
        }
    },
    is_active: {
        type: Number,
        default:1
    }, 
    is_approved: {
        type: Number,
        default:0
    }, 
    is_deleted: {
        type: Number,
        default:0
    },
    createdAt: Date,
    updatedAt: Date
},{
    collection: 'users'
});

var passengerSchema = new Schema({
    full_name: {
      type: String,
      required: [true,"Full name is required"] 
    },
    phone_number: {
      type: String,
      index: true,
      unique: [true,"Phone number must be unique."],
      required: [true,"Phone number is required"] 
    },
    user_role_id: {
      type: String, 
      required: [true,"User role is required"], 
      validate: {
          validator: function (value) {
              return value == 2; 
          },
          message: 'User role must be passenger'
        }
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
    collection: 'users'
  });
    
DriverSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});
    
DriverSchema.plugin(mongooseDateFormat);
DriverSchema.plugin(uniqueValidator, { message: '{PATH} is already registered' });
 
passengerSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});
    
passengerSchema.plugin(mongooseDateFormat);
passengerSchema.plugin(uniqueValidator, { message: '{PATH} is already registered' });

/* UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
}; */

var AdminDriverSchema = mongoose.model('AdminDriverSchema',DriverSchema);
var AdminPassengerSchema = mongoose.model('AdminPassengerSchema',passengerSchema);

module.exports = {
    AdminPassengerSchema: AdminPassengerSchema,
    AdminDriverSchema: AdminDriverSchema 
}; 