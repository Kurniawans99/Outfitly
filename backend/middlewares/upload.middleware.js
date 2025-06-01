import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Batasi ukuran file hanya 5MB
  },
  fileFilter: (req, file, cb) => {
    // Hanya izinkan jenis file gambar tertentu
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Terima file
    } else {
      cb(new Error("Only images (JPEG, PNG,  WEBP) are allowed"), false); // Tolak file
    }
  },
});

export default upload;
