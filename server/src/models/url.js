import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  longUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true,
    maxlength: [2048, 'URL cannot exceed 2048 characters'],
    validate: {
      validator: function(url) {
        try {
          const urlObj = new URL(url);
          return ['http:', 'https:'].includes(urlObj.protocol);
        } catch {
          return false;
        }
      },
      message: 'Please provide a valid HTTP or HTTPS URL'
    }
  },
  shortId: {
    type: String,
    required: [true, 'Short ID is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Short ID must be at least 3 characters'],
    maxlength: [20, 'Short ID cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Short ID can only contain letters, numbers, hyphens, and underscores']
  },
  clicks: {
    type: Number,
    default: 0,
    min: [0, 'Clicks cannot be negative']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
    index: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  expiresAt: {
    type: Date,
    default: null 
  }
}, {
  timestamps: true,
  toJSON: { 
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

urlSchema.index({ owner: 1, createdAt: -1 }); 

urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

urlSchema.virtual('isExpired').get(function() {
  return this.expiresAt && this.expiresAt < new Date();
});

urlSchema.statics.getPopular = function(limit = 10) {
  return this.find()
    .sort({ clicks: -1 })
    .limit(limit)
    .populate('owner', 'name email')
    .lean();
};

const Url = mongoose.model('Url', urlSchema);
export default Url;
