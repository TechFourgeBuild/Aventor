import imageCompression from "browser-image-compression";
import { supabase } from './supabase';

/**
 * Compressing an image file to be under target size (default 80KB)
 * @param {File} file - The original image file
 * @param {number} maxSizeKB - Maximum file size in KB (default 80)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressAvatarImage = async (file, maxSizeKB = 80) => {
  // If file is already smaller than target, return as is
  if (file.size <= maxSizeKB * 1024) {
    return file;
  }

  const options = {
    maxSizeMB: maxSizeKB / 1024, // Converting KB to MB (80KB = 0.08MB)
    maxWidthOrHeight: 600, // Smaller dimension for avatars (600px)
    useWebWorker: true, // Use web worker for better performance
    fileType: "image/jpeg", // Converting to JPEG for smaller size
    initialQuality: 0.7, // Start with 70% quality
    // Additional options for better compression
    alwaysKeepResolution: false,
    preserveExif: false, // Remove EXIF data to save space
  };

  try {
    const compressedFile = await imageCompression(file, options);

    // If still too large, compress further
    if (compressedFile.size > maxSizeKB * 1024) {
      const moreCompressed = await imageCompression(file, {
        ...options,
        maxSizeMB: (maxSizeKB / 1024) * 0.7, // Reducing to 70% of target
        initialQuality: 0.5,
      });
      return moreCompressed;
    }

    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    return file; // Returning original file if compression fails
  }
};

/**
 * Get image as Blob URL for preview
 * @param {File} file - Image file
 * @returns {string} - Object URL
 */
export const getImagePreviewUrl = (file) => {
  if (!file) return null;
  return URL.createObjectURL(file);
};

/**
 * Revoke object URL to free memory
 * @param {string} url - Object URL to revoke
 */
export const revokeImagePreviewUrl = (url) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};

// this new function to delete old avatar
export const deleteOldAvatar = async (userId, oldAvatarUrl) => {
  if (!oldAvatarUrl || !userId) return false;

  // Skip if it's the default avatar URL
  if (oldAvatarUrl.includes("unsplash.com")) return false;

  // Extract file path from URL
  // URL format: https://.../storage/v1/object/public/avatars/user-id/filename.jpg
  const urlParts = oldAvatarUrl.split("/avatars/");
  if (urlParts.length < 2) return false;

  const filePath = urlParts[1];

  const { error } = await supabase.storage.from("avatars").remove([filePath]);

  if (error) {
    console.error("Error deleting old avatar:", error);
    return false;
  }

  console.log("Old avatar deleted successfully:", filePath);
  return true;
};
