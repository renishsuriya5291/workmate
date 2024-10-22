const express = require("express");
const multer = require("multer");
const authenticateToken = require("../middleware");
const { uploadPdf } = require("../middleware/multerForPdf");
const { uploadCloudinary } = require("../utils/cloudniry");
const {
  createProposal,
  getAll,
  update,
  deletePro,
  query,
} = require("../controllers/proposal");
const fs = require("fs");
const router = express.Router();

router.post("/create/:jobId", authenticateToken, createProposal);
router.get("/all", authenticateToken, getAll);
router.put("/update/:jobId/:proId", update);
router.delete("/delete/:proId", deletePro);
router.get("/proposals/:jobId", query);
// Upload route
router.post(
  "/upload",
  authenticateToken,
  uploadPdf.array("files", 10), // Handle up to 10 files
  async (req, res) => {
    console.log(req.files);
    try {
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
      }

      const uploadPromises = req.files.map(async (file) => {
        try {
          const cloudinaryResult = await uploadCloudinary(file.path);
          // Delete the local file after upload
          fs.unlink(file.path, (err) => {
            if (err) {
              console.error("Error deleting local file:", err);
            }
          });
          return cloudinaryResult.secure_url; // Return the URL
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
          throw new Error("Error uploading to Cloudinary");
        }
      });

      const imageUrls = await Promise.all(uploadPromises); // Wait for all uploads to complete

      // File upload was successful
      return res.status(200).json({
        success: true,
        message: "Files uploaded successfully",
        imageUrls, // Send back all uploaded image URLs
      });
    } catch (error) {
      // Handle any errors that occur during the upload
      return res.status(500).json({
        message: "An error occurred during file upload.",
        error: error.message,
      });
    }
  }
);

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer specific errors
    return res.status(400).json({ message: err.message });
  } else if (err) {
    // Handle other types of errors
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
