const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
      folder: "uploads",
    });

    // After successful upload, delete the local file
    await fs.unlink(localFilePath);

    // Return the Cloudinary response
    return response;
  } catch (error) {
    // console.error("Error uploading file to Cloudinary:", error);

    // Attempt to delete the local file if the upload failed
    try {
      await fs.unlink(localFilePath);
    } catch (unlinkError) {
      // console.error(
      //   "Error deleting local file after upload failure:",
      //   unlinkError
      // );
    }

    return null;
  }
};

module.exports = { uploadCloudinary };
