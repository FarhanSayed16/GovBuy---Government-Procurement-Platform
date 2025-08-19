import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message || 'Unknown error'; //this because it is Non-Enumerable property
    error.statusCode = err.statusCode
    error.errors = err.errors
    error.isOperational=err.isOperational
    // Log error for development
    // Log error safely
    if (process.env.NODE_ENV === 'development') {
        console.error(`Error: ${err.message}`.red);
        console.error(err.stack);
      }

    // Mongoose bad ObjectId (CastError)
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ApiError(404, message);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        const message = `Validation failed: ${messages.join('. ')}`;
        error = new ApiError(400, message, messages);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate field value (${field}) entered`;
        error = new ApiError(400, message);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token, please login again';
        error = new ApiError(401, message);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired, please login again';
        error = new ApiError(401, message);
    }

    // Default to 500 server error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Server Error';

    // Determine if error is operational
    const isOperational = error.isOperational || false;

    // Send response
    res.status(statusCode).json(
        new ApiResponse(
            statusCode,
            null,
            message,
            !isOperational ? undefined : {
                errors: error.errors,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            }
        )
    );
};

export { errorHandler };