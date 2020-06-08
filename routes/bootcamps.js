const express = require('express');
const { 
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

//  Include other resource's routers, to access their endpoints (ie. getCourses)
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();

// Include protect middleware for protected routes
const { protect, authorise } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

//  Re-route this particular URI to other resource router
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance')
.get(getBootcampsInRadius);

router
.route('/')
// Passing advancedResults middleware to controller
.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
.post(protect, authorise('publisher', 'admin'), createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(protect, authorise('publisher', 'admin'), updateBootcamp)
.delete(protect, authorise('publisher', 'admin'), deleteBootcamp);

router.route('/:id/photo')
.put(protect, authorise('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;
