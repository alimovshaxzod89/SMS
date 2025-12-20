const mongoose = require('mongoose');

// ✅ Helper function for validation errors
const validationError = (res, message) => {
  return res.status(400).json({
    success: false,
    error: message
  });
};

// ✅ Validate student creation
exports.validateStudent = (req, res, next) => {
  const {
    username,
    password,
    name,
    surname,
    birthday,
    sex,
    gradeId,
    classId,
    email,
    phone
  } = req.body;

  // Required fields
  if (!username || !password || !name || !surname || !birthday || !sex) {
    return validationError(res, 'Please provide all required fields: username, password, name, surname, birthday, sex');
  }

  // Username validation
  if (username.length < 3 || username.length > 30) {
    return validationError(res, 'Username must be between 3 and 30 characters');
  }

  // Username format (only alphanumeric and underscore)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return validationError(res, 'Username can only contain letters, numbers, and underscores');
  }

  // Password validation
  if (password.length < 8) {
    return validationError(res, 'Password must be at least 8 characters long');
  }

  // Name validation
  if (name.length < 2 || name.length > 50) {
    return validationError(res, 'Name must be between 2 and 50 characters');
  }

  if (surname.length < 2 || surname.length > 50) {
    return validationError(res, 'Surname must be between 2 and 50 characters');
  }

  // Birthday validation
  const birthDate = new Date(birthday);
  if (isNaN(birthDate.getTime())) {
    return validationError(res, 'Invalid birthday format');
  }

  const age = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  if (age < 5 || age > 20) {
    return validationError(res, 'Student must be between 5 and 20 years old');
  }

  // Sex validation
  if (!['male', 'female'].includes(sex.toLowerCase())) {
    return validationError(res, 'Sex must be either male or female');
  }

  // Email validation (optional)
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return validationError(res, 'Invalid email format');
    }
  }

  // Phone validation (optional)
  if (phone) {
    // Uzbekistan phone number format: +998XXXXXXXXX or 998XXXXXXXXX
    const phoneRegex = /^(\+?998)?[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return validationError(res, 'Invalid phone number format');
    }
  }

  // Blood type validation (optional)
  if (req.body.bloodType) {
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(req.body.bloodType)) {
      return validationError(res, 'Invalid blood type');
    }
  }

  // ObjectId validations
  if (gradeId && !mongoose.Types.ObjectId.isValid(gradeId)) {
    return validationError(res, 'Invalid grade ID format');
  }

  if (classId && !mongoose.Types.ObjectId.isValid(classId)) {
    return validationError(res, 'Invalid class ID format');
  }

  next();
};

// ✅ Validate student update
exports.validateStudentUpdate = (req, res, next) => {
  const {
    username,
    password,
    name,
    surname,
    birthday,
    sex,
    gradeId,
    classId,
    email,
    phone
  } = req.body;

  // At least one field must be provided
  if (!username && !password && !name && !surname && !birthday && 
      !sex && !gradeId && !classId && !email && !phone && 
      !req.body.address && !req.body.bloodType && !req.body.parentId) {
    return validationError(res, 'Please provide at least one field to update');
  }

  // Username validation (if provided)
  if (username !== undefined) {
    if (username.length < 3 || username.length > 30) {
      return validationError(res, 'Username must be between 3 and 30 characters');
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return validationError(res, 'Username can only contain letters, numbers, and underscores');
    }
  }

  // Password validation (if provided)
  if (password !== undefined && password.trim() !== '') {
    if (password.length < 8) {
      return validationError(res, 'Password must be at least 8 characters long');
    }
  }

  // Name validation (if provided)
  if (name !== undefined) {
    if (name.length < 2 || name.length > 50) {
      return validationError(res, 'Name must be between 2 and 50 characters');
    }
  }

  if (surname !== undefined) {
    if (surname.length < 2 || surname.length > 50) {
      return validationError(res, 'Surname must be between 2 and 50 characters');
    }
  }

  // Birthday validation (if provided)
  if (birthday !== undefined) {
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) {
      return validationError(res, 'Invalid birthday format');
    }

    const age = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (age < 5 || age > 20) {
      return validationError(res, 'Student must be between 5 and 20 years old');
    }
  }

  // Sex validation (if provided)
  if (sex !== undefined) {
    if (!['male', 'female'].includes(sex.toLowerCase())) {
      return validationError(res, 'Sex must be either male or female');
    }
  }

  // Email validation (if provided)
  if (email !== undefined && email !== null && email !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return validationError(res, 'Invalid email format');
    }
  }

  // Phone validation (if provided)
  if (phone !== undefined && phone !== null && phone !== '') {
    const phoneRegex = /^(\+?998)?[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return validationError(res, 'Invalid phone number format');
    }
  }

  // Blood type validation (if provided)
  if (req.body.bloodType !== undefined) {
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(req.body.bloodType)) {
      return validationError(res, 'Invalid blood type');
    }
  }

  // ObjectId validations
  if (gradeId && !mongoose.Types.ObjectId.isValid(gradeId)) {
    return validationError(res, 'Invalid grade ID format');
  }

  if (classId && !mongoose.Types.ObjectId.isValid(classId)) {
    return validationError(res, 'Invalid class ID format');
  }

  next();
};