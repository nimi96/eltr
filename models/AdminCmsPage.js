var mongoose = require('mongoose'), mongooseIntl = require('mongoose-intl'),Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const mongooseDateFormat = require('mongoose-date-format');
var mongoosePaginate = require('mongoose-paginate');
var uniqueValidator = require('mongoose-unique-validator');

var adminCmsPageSchema = new Schema({ 
    name: {
          type: String,
          required: [true,"Name is required"] 
      },
    title: {
          type: String,
          intl: true,
          unique: [true,"Title must be unique."],
          required: [true,"Title is required"] 
      },
    description: {
          type: String,
          intl: true,
          required: [true,"Description is required"]
      }, 
    slug: {
          type: String,
          unique: [true,"Title must be unique."],
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
    collection: 'cmspages'
});
  
adminCmsPageSchema.pre('save', function (next) {
    let now = Date.now()
    
    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
    this.createdAt = now
    }
    // Call the next function in the pre-save chain
    next() 
});
    
adminCmsPageSchema.plugin(mongooseDateFormat);
adminCmsPageSchema.plugin(mongoosePaginate);
adminCmsPageSchema.plugin(uniqueValidator, { message: '{PATH} must be uinque' });
adminCmsPageSchema.plugin(mongooseIntl, { languages: ['en', 'uz', 'ru'], defaultLanguage: 'en' });
module.exports = mongoose.model('AdminCmsPage', adminCmsPageSchema);