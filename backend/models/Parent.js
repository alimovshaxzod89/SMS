const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'ID is required'],
    unique: true,
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for students
parentSchema.virtual('students', {
  ref: 'Student',
  localField: 'id',
  foreignField: 'parentId'
});

// Virtual for full name
parentSchema.virtual('fullName').get(function() {
  return `${this.name} ${this.surname}`;
});

// Exclude password from JSON
parentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('Parent', parentSchema);