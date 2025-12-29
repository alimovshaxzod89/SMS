const Grade = require('../models/Grade');
const mongoose = require('mongoose');

// Get All Grades
exports.getAllGrades = async (req, res, next) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    
    // Validate and sanitize pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 100));

    const grades = await Grade.find()
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort({ level: 1 }) // Level bo'yicha tartiblash
      .lean();

    const count = await Grade.countDocuments();

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limitNum),
      currentPage: pageNum,
      data: grades
    });
  } catch (error) {
    console.error('Error in getAllGrades:', error);
    next(error);
  }
};

// Get Single Grade
exports.getGrade = async (req, res, next) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid grade ID format'
      });
    }

    const grade = await Grade.findById(req.params.id).lean();
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        error: 'Grade not found'
      });
    }

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (error) {
    console.error('Error in getGrade:', error);
    next(error);
  }
};

// Create Grade
exports.createGrade = async (req, res, next) => {
  try {
    const { level } = req.body;

    // Validate level
    if (!level || typeof level !== 'number' || level < 1) {
      return res.status(400).json({
        success: false,
        error: 'Level must be a positive number'
      });
    }

    // Check if grade level already exists
    const existingGrade = await Grade.findOne({ level });
    if (existingGrade) {
      return res.status(400).json({
        success: false,
        error: 'Grade level already exists'
      });
    }

    const grade = await Grade.create({ level });

    res.status(201).json({
      success: true,
      data: grade
    });
  } catch (error) {
    console.error('Error in createGrade:', error);
    
    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Grade level already exists'
      });
    }
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    next(error);
  }
};

// Update Grade
exports.updateGrade = async (req, res, next) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid grade ID format'
      });
    }

    const { level } = req.body;

    // Validate level if provided
    if (level !== undefined) {
      if (typeof level !== 'number' || level < 1) {
        return res.status(400).json({
          success: false,
          error: 'Level must be a positive number'
        });
      }

      // Check if another grade with this level exists
      const existingGrade = await Grade.findOne({ 
        level,
        _id: { $ne: req.params.id }
      });
      if (existingGrade) {
        return res.status(400).json({
          success: false,
          error: 'Grade level already exists'
        });
      }
    }

    const grade = await Grade.findByIdAndUpdate(
      req.params.id,
      { level },
      { 
        new: true, 
        runValidators: true 
      }
    ).lean();

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: 'Grade not found'
      });
    }

    res.status(200).json({
      success: true,
      data: grade
    });
  } catch (error) {
    console.error('Error in updateGrade:', error);
    
    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Grade level already exists'
      });
    }
    
    // Validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    
    next(error);
  }
};

// Delete Grade
exports.deleteGrade = async (req, res, next) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid grade ID format'
      });
    }

    const grade = await Grade.findByIdAndDelete(req.params.id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: 'Grade not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteGrade:', error);
    next(error);
  }
};

