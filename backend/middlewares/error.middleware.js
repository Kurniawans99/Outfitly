const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new Error(message.join(", "));
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate subscription detected";
    error = new Error(message);
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new Error(message);
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  // Handle enum validation errors
  if (err.message.includes("is not a valid enum value")) {
    const message = `Invalid value provided for ${err.path}`;
    error = new Error(message);
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }

  // Handle date validation errors
  if (
    err.message.includes("Start date must be in the past") ||
    err.message.includes("Renewal date must be after the start date")
  ) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });

  next();
};

export default errorHandler;
