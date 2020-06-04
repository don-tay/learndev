const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const geocoder = require('../utils/geocoder');
const asyncHandler = require('../middleware/async');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // res come from advancedResults middleware (see routing for this method)
    res.status(200).json(res.advancedResults);
});

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
    }
    
    res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
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
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);
    
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
        }
    
        await bootcamp.remove();

        res.status(200).json({ success: true, data: {} });   
});

// @desc    Get all bootcamps within a radius from give zipcode
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
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

// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    // console.log(req.files);

    const file = req.files.file;

    // Check file is photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`, 400));
    }

    // Create custom filename (ie. photo_<bootcampId>.<file_ext>)
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(
                new ErrorResponse(
                    `Problem with file upload. Please try again.`,
                    500
                )
            );
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })
    });
});
