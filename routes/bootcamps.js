const express = require('express');
const { 
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius
 } = require('../controllers/bootcamps');

//  Include other resource's routers, to access their endpoints (ie. getCourses)
const courseRouter = require('./courses');

const router = express.Router();

//  Re-route this particular URI to other resource router
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance')
.get(getBootcampsInRadius);

router
.route('/')
.get(getBootcamps)
.post(createBootcamp);

router.route('/:id')
.get(getBootcamp)
.put(updateBootcamp)
.delete(deleteBootcamp);

module.exports = router;
