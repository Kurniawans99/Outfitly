const errorHandler = (err, req, res, next) => {
  // Log error untuk debugging (terutama di lingkungan pengembangan)
  if (process.env.NODE_ENV === "development") {
    console.error("--- ERROR LOG START ---");
    console.error("Name:", err.name);
    console.error("Code:", err.code);
    console.error("Message:", err.message);
    console.error("--- ERROR LOG END ---");
  }

  let statusCode = err.statusCode || 500;
  let responseMessage = err.message || "Terjadi kesalahan pada server.";

  // Mongoose Bad ObjectId (CastError)
  // Seringkali berarti sumber daya tidak ditemukan karena format ID tidak valid.
  if (err.name === "CastError") {
    statusCode = 404;
    responseMessage = `Sumber daya tidak ditemukan. ID '${err.value}' untuk field '${err.path}' tidak valid.`;
  }
  // Mongoose Duplicate Key Error (kode error 11000)
  else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    responseMessage = `Nilai '${value}' untuk field '${field}' sudah ada. Silakan gunakan nilai lain.`;
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const errorMessages = Object.values(err.errors).map((el) => el.message);

    responseMessage =
      errorMessages.length > 1 ? errorMessages.join("; ") : errorMessages[0];
    if (errorMessages.length > 1) {
      responseMessage = `Validasi gagal: ${errorMessages.join("; ")}`;
    } else {
      responseMessage = errorMessages[0] || "Data yang diberikan tidak valid.";
    }
  }
  // Kirim respons JSON
  res.status(statusCode).json({
    success: false,
    message: responseMessage,
  });
};

export default errorHandler;
