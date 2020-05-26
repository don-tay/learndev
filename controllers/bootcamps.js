const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @acess   Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @acess   Public
exports.getBootcamp = async  (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
        }
        res.status(200).json({ success: true, data: bootcamp });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @acess   Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update new bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @acess   Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
        }
    
        res.status(200).json({ success: true, data: bootcamp });   
    } catch (err) {
        next(err);
    }
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @acess   Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    
        if (!bootcamp) {
            return next(new ErrorResponse(`Bootcamp id ${req.params.id} not found`, 404));
        }
    
        res.status(200).json({ success: true, data: {} });   
    } catch (err) {
        next(err);
    }
};
