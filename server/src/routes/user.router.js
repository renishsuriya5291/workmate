const express = require("express");
const router = express.Router();
const User = require("../models/User");
const UserController = require("../controllers/UserController");
const authenticateToken = require("../middleware");
const { upload } = require("../middleware/multer");
const { uploadCloudinary } = require("../utils/cloudniry");
const fs = require("fs");

router.get("/", UserController.getUser);
router.put("/update", authenticateToken, UserController.update);
router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const fileName = req.headers["x-file-name"];

    let localFilePath = null;

    try {
      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Path of the file uploaded by Multer
      localFilePath = req.file.path;

      // Upload the file to Cloudinary
      const cloudinaryResult = await uploadCloudinary(localFilePath);

      // Check if the Cloudinary upload was successful
      if (!cloudinaryResult) {
        // Handle Cloudinary upload failure
        return res
          .status(500)
          .json({ message: "Error uploading to Cloudinary" });
      }

      // If upload was successful, update user profile
      if (fileName === "profile") {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Update the user's profile picture with the Cloudinary URL
        user.profilePicture = cloudinaryResult.secure_url;
        await user.save();
      }

      // Delete the file from local storage after successful upload
      fs.unlink(localFilePath, (err) => {
        if (err) {
          console.error("Error deleting local file:", err);
        }
      });

      // Respond with Cloudinary image URL
      return res.status(200).json({
        success: true,
        message: "File uploaded successfully",
        imageUrl: cloudinaryResult.secure_url,
      });
    } catch (error) {
      console.error("Error processing upload:", error);

      // Clean up the local file in case of an error
      if (localFilePath) {
        fs.unlink(localFilePath, (err) => {
          if (err) {
            console.error("Error deleting local file:", err);
          }
        });
      }

      return res.status(500).json({ message: "Server error" });
    }
  }
);
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(500).json({ message: err.message }); // Multer specific error
  } else if (err) {
    return res.status(400).json({ message: err.message }); // Other errors
  }
  next();
});

module.exports = router;
