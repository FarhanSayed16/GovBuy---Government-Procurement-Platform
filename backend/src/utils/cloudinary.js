import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const resoponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "govbuy/documents", // optional folder
      use_filename: true, // keep original name
      unique_filename: false,
    });
    //response returns an array

    //file uploaded successfully
    fs.unlinkSync(localFilePath);
    console.log("File is uplaoded on cloudinary successfully ", resoponse.url);
    return resoponse;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove locally stored file on the server
    console.log("Error while uploading file on cloudinary");
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'raw'  // or 'image' if deleting images
    });
    console.log('Deleted from Cloudinary:', result);
    return result;
  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
