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
 const advancedResults = require('../middleware/advancedResults');

//  Include other resource's routers, to access their endpoints (ie. getCourses)
const courseRouter = require('./courses');

const router = express.Router();

//  Re-route this particular URI to other resource router
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance')
.get(getBootcampsInRadius);

router
.route('/')
// Passing advancedResults middleware to controller
.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);

router.route('/:id/photo')
.put(bootcampPhotoUpload);

module.exports = router;
