const mongoose = require('mongoose');

// ✅ Helper function for validation errors
const validationError = (res, message) => {
  return res.status(400).json({
    success: false,
    error: message
  });
};

// ✅ Validate subject creation
exports.validateSubject = (req, res, next) => {
  const { name, teachers } = req.body;

  // Required fields
  if (!name) {
    return validationError(res, 'Subject name is required');
  }

  // Name validation
  if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return validationError(res, 'Subject name must be between 2 and 100 characters');
  }

  // Teachers validation (optional array)
  if (teachers !== undefined) {
    if (!Array.isArray(teachers)) {
      return validationError(res, 'Teachers must be an array');
    }

    // Check if teachers array has valid ObjectIds
    for (const teacherId of teachers) {
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return validationError(res, `Invalid teacher ID format: ${teacherId}`);
      }
    }

    // Remove duplicates
    const uniqueTeachers = [...new Set(teachers.map(id => id.toString()))];
    if (uniqueTeachers.length !== teachers.length) {
      return validationError(res, 'Duplicate teacher IDs found');
    }

    // Limit number of teachers per subject
    if (teachers.length > 20) {
      return validationError(res, 'A subject cannot have more than 20 teachers');
    }
  }

  next();
};

// ✅ Validate subject update
exports.validateSubjectUpdate = (req, res, next) => {
  const { name, teachers } = req.body;

  // At least one field must be provided
  if (name === undefined && teachers === undefined) {
    return validationError(res, 'Please provide at least one field to update');
  }

  // Name validation (if provided)
  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return validationError(res, 'Subject name cannot be empty');
    }
    if (name.length < 2 || name.length > 100) {
      return validationError(res, 'Subject name must be between 2 and 100 characters');
    }
  }

  // Teachers validation (if provided)
  if (teachers !== undefined) {
    if (!Array.isArray(teachers)) {
      return validationError(res, 'Teachers must be an array');
    }

    for (const teacherId of teachers) {
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return validationError(res, `Invalid teacher ID format: ${teacherId}`);
      }
    }

    // Remove duplicates
    const uniqueTeachers = [...new Set(teachers.map(id => id.toString()))];
    if (uniqueTeachers.length !== teachers.length) {
      return validationError(res, 'Duplicate teacher IDs found');
    }

    if (teachers.length > 20) {
      return validationError(res, 'A subject cannot have more than 20 teachers');
    }
  }

  next();
};