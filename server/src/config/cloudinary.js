import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from './envConfig.js';

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUDNAME,
  api_key: envConfig.CLOUDINARY_APIKEY,
  api_secret: envConfig.CLOUDINARY_APISECRET,
  secure: true,
});

/**
 * Delete a single asset from Cloudinary by public_id.
 * Returns true on success or if the asset didn't exist.
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return true;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return result.result === 'ok' || result.result === 'not found';
  } catch (err) {
    console.error(`Cloudinary delete failed for ${publicId}:`, err.message);
    return false;
  }
};

/**
 * Delete multiple assets, ignoring failures.
 */
export const deleteManyFromCloudinary = async (publicIds = []) => {
  const ids = publicIds.filter(Boolean);
  if (!ids.length) return;
  await Promise.allSettled(ids.map((id) => deleteFromCloudinary(id)));
};

export default cloudinary;