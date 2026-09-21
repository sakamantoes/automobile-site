const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`;

export function imageUrl(value) {
  if (!value) return '';
  if (value.startsWith('http') || value.startsWith('data:')) return value;
  return `${API_URL.replace('/api', '')}${value}`;
}

export async function getListings(type) {
  const response = await fetch(`${API_URL}/listings?type=${encodeURIComponent(type)}`);
  if (!response.ok) throw new Error('Could not load listings');
  return response.json();
}

export async function loginAdmin(credentials) {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Invalid admin credentials');
  return response.json();
}

export async function uploadImageToCloudinary(image) {
  if (!import.meta.env.VITE_CLOUD_NAME || !import.meta.env.VITE_CLOUDINARY_PRESET) {
    throw new Error('Cloudinary environment variables are not configured');
  }

  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: formData });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message || 'Could not upload image to Cloudinary');
  return result.secure_url;
}

export async function createListing(token, listing) {
  const response = await fetch(`${API_URL}/listings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(listing),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Could not create listing');
  }
  return response.json();
}

export async function deleteListing(token, id) {
  const response = await fetch(`${API_URL}/listings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Could not delete listing');
}
