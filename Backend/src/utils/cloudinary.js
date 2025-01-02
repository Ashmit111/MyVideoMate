import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
              if (error) return reject(error);
              resolve(result);
          }
      );
      stream.end(fileBuffer);
  });
};


const deleteFromCloudinary = async (url) => {
    try {
      // Extract the public ID from the URL
      const publicId = url.split('/').slice(-1)[0].split('.')[0];
      const response = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image"
      });
      return response;
    } catch (error) {
      console.error("Failed to delete from Cloudinary", error);
      return null;
    }
  };



export {uploadOnCloudinary, deleteFromCloudinary }