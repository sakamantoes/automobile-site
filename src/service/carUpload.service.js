// src/services/carUpload.service.js
import { api } from './api.js';

/**
 * Upload a car listing.
 *
 * @param {Object} payload
 * @param {Object} payload.coverImage   { url, publicId }
 * @param {Array}  payload.subImages    [{ url, publicId, label? }]
 * @param {Array}  payload.galleries    [{ label, images: [{ url, publicId }] }]
 * @param {'gallery'|'new-arrivals'} payload.section
 */
export const carService = {
  // ---- public reads ----
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/listings${qs ? `?${qs}` : ''}`);
  },
  get: (id) => api.get(`/listings/${id}`),

  // ---- admin writes ----
  create: (payload) =>
    api.post('/listings', { ...payload, type: 'car' }),

  update: (id, payload) =>
    api.put(`/listings/${id}`, { ...payload, type: 'car' }),

  remove: (id) => api.delete(`/listings/${id}`),
};