const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    console.error(err?.stack.red);
    // console.error(`err.name is ${err?.name}`.bgRed);
    // console.error(`err.code is ${err?.code}`.bgRed);
    // console.error(err);

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose input validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((e) => e.message);
        error = new ErrorResponse(message, 400);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || `Server Error`,
    });
};

module.exports = errorHandler;
