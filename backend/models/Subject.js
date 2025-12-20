const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Subject name must be at least 2 characters'],
    maxlength: [100, 'Subject name cannot exceed 100 characters']
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId, // ✅ TO'G'RI: ObjectId (String emas!)
    ref: 'Teacher'
  }]
}, {
  timestamps: true
});

// ✅ Index for faster lookups
subjectSchema.index({ name: 1 });
subjectSchema.index({ teachers: 1 });
subjectSchema.index({ createdAt: -1 });

// ✅ Exclude sensitive data from JSON response
subjectSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Subject', subjectSchema);