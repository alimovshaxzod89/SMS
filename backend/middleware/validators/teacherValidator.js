const mongoose = require('mongoose');

// ✅ Helper function for validation errors
const validationError = (res, message) => {
  return res.status(400).json({
    success: false,
    error: message
  });
};

// ✅ Validate teacher creation
exports.validateTeacher = (req, res, next) => {
  const {
    username,
    password,
    name,
    surname,
    email,
    phone,
    address,
    bloodType,
    birthday,
    sex,
    subjects
  } = req.body;

  // Required fields
  if (!username || !password || !name || !surname || !address || !bloodType || !birthday || !sex) {
    return validationError(res, 'Please provide all required fields: username, password, name, surname, address, bloodType, birthday, sex');
  }

  // Username validation
  if (username.length < 3 || username.length > 20) {
    return validationError(res, 'Username must be between 3 and 20 characters');
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

  // Address validation
  if (address.length < 5 || address.length > 200) {
    return validationError(res, 'Address must be between 5 and 200 characters');
  }

  // Birthday validation
  const birthDate = new Date(birthday);
  if (isNaN(birthDate.getTime())) {
    return validationError(res, 'Invalid birthday format');
  }

  // Sex validation
  if (!['male', 'female'].includes(sex.toLowerCase())) {
    return validationError(res, 'Sex must be either male or female');
  }

  // Blood type validation
  const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  if (!validBloodTypes.includes(bloodType)) {
    return validationError(res, 'Invalid blood type. Must be one of: ' + validBloodTypes.join(', '));
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
    // International format: +998XXXXXXXXX
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return validationError(res, 'Invalid phone number format');
    }
  }

  // Subjects validation (optional array)
  if (subjects !== undefined) {
    if (!Array.isArray(subjects)) {
      return validationError(res, 'Subjects must be an array');
    }

    // Check if subjects array has valid ObjectIds
    for (const subjectId of subjects) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return validationError(res, `Invalid subject ID format: ${subjectId}`);
      }
    }

    // Limit number of subjects
    if (subjects.length > 10) {
      return validationError(res, 'A teacher cannot have more than 10 subjects');
    }
  }

  next();
};

// ✅ Validate teacher update
exports.validateTeacherUpdate = (req, res, next) => {
  const {
    username,
    password,
    name,
    surname,
    email,
    phone,
    address,
    bloodType,
    birthday,
    sex,
    subjects
  } = req.body;

  // At least one field must be provided
  const hasFields = username || password || name || surname || email || 
                    phone || address || bloodType || birthday || sex || subjects;
  
  if (!hasFields) {
    return validationError(res, 'Please provide at least one field to update');
  }

  // Username validation (if provided)
  if (username !== undefined) {
    if (username.length < 3 || username.length > 20) {
      return validationError(res, 'Username must be between 3 and 20 characters');
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

  // Address validation (if provided)
  if (address !== undefined) {
    if (address.length < 5 || address.length > 200) {
      return validationError(res, 'Address must be between 5 and 200 characters');
    }
  }

  // Birthday validation (if provided)
  if (birthday !== undefined) {
    const birthDate = new Date(birthday);
    if (isNaN(birthDate.getTime())) {
      return validationError(res, 'Invalid birthday format');
    }
  }

  // Sex validation (if provided)
  if (sex !== undefined) {
    if (!['male', 'female'].includes(sex.toLowerCase())) {
      return validationError(res, 'Sex must be either male or female');
    }
  }

  // Blood type validation (if provided)
  if (bloodType !== undefined) {
    const validBloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    if (!validBloodTypes.includes(bloodType)) {
      return validationError(res, 'Invalid blood type. Must be one of: ' + validBloodTypes.join(', '));
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
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return validationError(res, 'Invalid phone number format');
    }
  }

  // Subjects validation (if provided)
  if (subjects !== undefined) {
    if (!Array.isArray(subjects)) {
      return validationError(res, 'Subjects must be an array');
    }

    for (const subjectId of subjects) {
      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return validationError(res, `Invalid subject ID format: ${subjectId}`);
      }
    }

    if (subjects.length > 10) {
      return validationError(res, 'A teacher cannot have more than 10 subjects');
    }
  }

  next();
};