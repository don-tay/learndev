const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @acess   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find();
    
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @acess   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
    }
    
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @acess   Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Update new bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @acess   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
    }

    res.status(200).json({ success: true, data: bootcamp });   
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @acess   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
        }
    
        res.status(200).json({ success: true, data: {} });   
});

// @desc    Get all bootcamps within a radius from give zipcode
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @acess   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radins
    // Divide dist by radius of Earth
    // Earth radius = 6378km
    const radius = distance / 6378;

    const bootcamps = await Bootcamp.find({
        // from mongodb geospatial query doc: https://docs.mongodb.com/manual/reference/operator/query/centerSphere/
       location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});