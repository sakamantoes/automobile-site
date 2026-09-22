// src/services/cloudinary.service.js

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.warn(
    '[cloudinary] Missing VITE_CLOUD_NAME or VITE_CLOUDINARY_PRESET in .env'
  );
}

const ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload a single File to Cloudinary (unsigned preset).
 * Returns { url, publicId, width, height, format } or throws.
 */
export const uploadImage = async (file, { folder = 'lordgroup' } = {}) => {
  if (!file) throw new Error('No file provided');
  if (!file.type?.startsWith('image/')) throw new Error('Not an image file');

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);
  if (folder) form.append('folder', folder);

  const res = await fetch(ENDPOINT, { method: 'POST', body: form });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed');
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
    format: data.format,
  };
};

/**
 * Upload many files, reporting progress. Returns array of results in order.
 */
export const uploadImages = async (files, { folder, onProgress } = {}) => {
  const arr = Array.from(files);
  const results = [];
  let done = 0;

  for (const file of arr) {
    const result = await uploadImage(file, { folder });
    results.push(result);
    done += 1;
    onProgress?.(Math.round((done / arr.length) * 100));
  }
  return results;
};