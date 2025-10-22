const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalTitle: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1888,
    max: new Date().getFullYear() + 5
  },
  director: {
    type: String,
    required: true,
    trim: true
  },
  genre: [{
    type: String,
    required: true,
    trim: true
  }],
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  imdbRating: {
    type: Number,
    min: 0,
    max: 10
  },
  description: {
    type: String,
    required: true,
    minlength: 50
  },
  detailedPlot: {
    type: String,
    required: true,
    minlength: 200
  },
  cast: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    character: {
      type: String,
      trim: true
    },
    image: String
  }],
  images: {
    poster: {
      type: String,
      required: true
    },
    backdrop: String,
    gallery: [String]
  },
  trailer: {
    type: String
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  language: [{
    type: String,
    required: true,
    trim: true
  }],
  budget: {
    type: Number
  },
  boxOffice: {
    type: Number
  },
  awards: [{
    name: String,
    year: Number,
    category: String
  }],
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewRelease: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index'ler
filmSchema.index({ title: 'text', description: 'text', detailedPlot: 'text' });
filmSchema.index({ genre: 1 });
filmSchema.index({ year: -1 });
filmSchema.index({ rating: -1 });
filmSchema.index({ isFeatured: 1 });
filmSchema.index({ isNewRelease: 1 });

// Middleware
filmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Film', filmSchema);
