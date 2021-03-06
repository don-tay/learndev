const express = require('express');
const { 
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

const Course = require('../models/Course');

const router = express.Router({ mergeParams: true });

 // Include protect middleware for protected routes
const { protect, authorise } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router.route('/')
    .get(
        advancedResults(Course, {
        path: 'bootcamp',
        select: 'name description'
    }),
    getCourses)
    .post(protect, authorise('publisher', 'admin'), addCourse);

router.route('/:id')
    .get(getCourse)
    .put(protect, authorise('publisher', 'admin'), updateCourse)
    .delete(protect, authorise('publisher', 'admin'), deleteCourse);

module.exports = router;
