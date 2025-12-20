const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Teacher ID is required'],
    unique: true,
    trim: true,
    index: true // ✅ Index for faster lookups
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    trim: true,
    lowercase: true, // ✅ Store in lowercase for consistency
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // ✅ Don't include password in queries by default
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  surname: {
    type: String,
    required: [true, 'Surname is required'],
    trim: true,
    minlength: [2, 'Surname must be at least 2 characters'],
    maxlength: [50, 'Surname cannot exceed 50 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // ✅ Allows multiple null values
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    minlength: [5, 'Address must be at least 5 characters'],
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  img: {
    type: String,
    default: null
  },
  bloodType: {
    type: String,
    required: [true, 'Blood type is required'],
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood type'
    }
  },
  birthday: {
    type: Date,
    required: [true, 'Birthday is required'],
  },
  sex: {
    type: String,
    enum: {
      values: ['male', 'female'],
      message: '{VALUE} is not a valid gender'
    },
    required: [true, 'Gender is required'],
    lowercase: true
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  isActive: {
    type: Boolean,
    default: true,
    select: false // ✅ For soft delete functionality
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ Compound indexes for common queries
teacherSchema.index({ name: 1, surname: 1 });
teacherSchema.index({ subjects: 1 });
teacherSchema.index({ createdAt: -1 });

// ✅ Text index for search functionality
teacherSchema.index({ 
  name: 'text', 
  surname: 'text', 
  username: 'text',
  email: 'text'
});

// ✅ Virtual for full name
teacherSchema.virtual('fullName').get(function() {
  return `${this.name} ${this.surname}`;
});

// ✅ Virtual for age
teacherSchema.virtual('age').get(function() {
  if (!this.birthday) return null;
  
  const today = new Date();
  const birthDate = new Date(this.birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// ✅ Virtual for subject count
teacherSchema.virtual('subjectCount').get(function() {
  return this.subjects ? this.subjects.length : 0;
});

// ✅ Pre-save middleware: Validate subjects array length
teacherSchema.pre('save', function(next) {
  if (this.subjects && this.subjects.length > 10) {
    return next(new Error('A teacher cannot have more than 10 subjects'));
  }
  next();
});

// ✅ Pre-save middleware: Auto-lowercase username and sex
teacherSchema.pre('save', function(next) {
  if (this.isModified('username')) {
    this.username = this.username.toLowerCase();
  }
  if (this.isModified('sex')) {
    this.sex = this.sex.toLowerCase();
  }
  next();
});

// ✅ Instance method: Compare passwords
teacherSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = require('bcryptjs');
  // Need to explicitly select password since it's not selected by default
  const teacher = await this.constructor.findById(this._id).select('+password');
  return await bcrypt.compare(candidatePassword, teacher.password);
};

// ✅ Instance method: Get public profile (safe for external use)
teacherSchema.methods.getPublicProfile = function() {
  return {
    id: this.id,
    name: this.name,
    surname: this.surname,
    fullName: this.fullName,
    email: this.email,
    subjects: this.subjects
  };
};

// ✅ Static method: Find teachers by subject
teacherSchema.statics.findBySubject = function(subjectId) {
  return this.find({ subjects: subjectId })
    .populate('subjects', 'name code')
    .select('-password')
    .sort({ name: 1 });
};

// ✅ Static method: Search teachers
teacherSchema.statics.search = function(searchTerm) {
  return this.find(
    { $text: { $search: searchTerm } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .populate('subjects', 'name code')
    .select('-password');
};

// ✅ Query helper: Active teachers only
teacherSchema.query.active = function() {
  return this.where({ isActive: { $ne: false } });
};

// ✅ Exclude password and sensitive data from JSON response
teacherSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);