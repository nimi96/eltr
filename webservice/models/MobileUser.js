var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');

var DriverSchema = new Schema({
    lang: {
        type: String,
        default:"ru"
    }, 
    full_name: {
        type: String,
        required: [true,"_Eltar"] 
       // required: [true,global+""+lang+""+_ELTAR] 
    },
    phone_number: {
        type: String,
        index: true,
        unique: [true,"phone_number_must_be_unique"],
        required: [true,"phone_number_is_required"] 
    },
    car_model_id : { type: Schema.Types.ObjectId, ref: 'AdminCarModel', required: [true,"Car model id is required"]  },
    qty_of_passenger: {
        type: String, 
        required: [true,"qty_of_passenger_is_required"] 
    },
    car_number: {
        type: String, 
        required: [true,"car_number_is_required"] 
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
    device_id: {
        type: String,
        required: [true,"device_id_is_required"] 
    },
    device_type: {
        type: String,
        required: [true,"device_type_is_required"] 
    },
    user_role_id: {
        type: String, 
        required: [true,"user_role_is_required"], 
        validate: {
            validator: function (value) {
                return value == 3; 
            },
            message: 'user_role_must_be_driver'
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
    is_approved: {
        type: Number,
        default:0
    }, 
    otp: {
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
    profile_image: {
        type: String
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
    device_id: {
        type: String,
        required: [true,"Device id is required"] 
    },
    device_type: {
        type: String,
        required: [true,"Device type is required"] 
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
    otp: {
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

/* UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
}; */

var DriverSchema = mongoose.model('MobileUser',DriverSchema);
var PassengerSchema = mongoose.model('PassengerSchema',passengerSchema);

module.exports = {
    DriverSchema: DriverSchema,
    PassengerSchema: PassengerSchema 
};