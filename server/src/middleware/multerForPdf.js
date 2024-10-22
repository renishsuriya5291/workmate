const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public"); // Define the destination for saving files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define the filename
  },
});

const uploadPdf = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit in bytes
  },
  fileFilter: (req, file, cb) => {
    // Allow only PDF and JPEG files
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true); // Accept file
    }
    cb(new Error("Error: Only PDF and JPEG files are allowed!")); // Reject file
  },
});

// Export the uploadPdf middleware
module.exports = { uploadPdf: uploadPdf };
