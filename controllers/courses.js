const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId });
    } else {
        query = Course.find().populate({
            path: 'bootcamp',
            select: 'name description'
        });
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

// @desc    Get single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const query = Course.findById(id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    const course = await query;

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Add single course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) { // if bootcamp id not found, throw error
        return next(new ErrorResponse(`No bootcamp with id: ${req.params.bootcampId} found`), 404);
    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Update single course
// @route   PUT /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) { // if bootcamp id not found, throw error
        return next(new ErrorResponse(`No course with id: ${req.params.id} found`), 404);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc    Delete single course
// @route   DELETE /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) { // if bootcamp id not found, throw error
        return next(new ErrorResponse(`No course with id: ${req.params.id} found`), 404);
    }

    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});
