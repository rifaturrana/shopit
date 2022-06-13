const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }
  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;

    //Wrong Mongoose Object ID Error

    if (err.name === "CastError") {
      const errorMessage = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(errorMessage, 400);
    }

    //Validation Error
    if (err.name === "ValidationError") {
      const errorMessage = Object.values(err.errors).map(
        (value) => value.message
      );
      error = new ErrorHandler(errorMessage, 400);
    }
    //handling Mongoose Duplicate key Error

    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
      error = new ErrorHandler(errorMessage, 400);
    }

    //Handling wrong JWT error
    if (err.name === "JsonWebTokenError") {
      const errorMessage = "JSON Web Token is invalid. Try again!!!";
      error = new ErrorHandler(errorMessage, 400);
    }

    //Handling wrong Token Expire error
    if (err.name === "TokenExpiredError") {
      const errorMessage = "JSON Web Token is expired. Try again!!!";
      error = new ErrorHandler(errorMessage, 400);
    }
    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
