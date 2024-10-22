const multer = require("multer");

// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public"); // Define the destination for saving files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Define the filename
  },
});

// Multer upload configuration with 2MB limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB limit in bytes
  },
  fileFilter: (req, file, cb) => {
    // You can add file type validation here if needed
    const fileTypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = fileTypes.test(file.mimetype); // Check file type
    const mimetype = fileTypes.test(file.originalname.split(".").pop()); // Check extension
    if (extname && mimetype) {
      return cb(null, true); // Accept file
    }
    cb(new Error("Error: File type not allowed!")); // Reject file
  },
});

// Export the upload middleware using module.exports
module.exports = { upload };
