// src/services/sparePart.service.js
import { api } from './api.js';

export const sparePartService = {
  list: () => api.get('/listings?section=spare-parts'),
  get: (id) => api.get(`/listings/${id}`),

  create: ({ coverImage, ...rest }) =>
    api.post('/listings', {
      ...rest,
      type: 'spare-part',
      section: 'spare-parts',
      coverImage,
    }),

  update: (id, { coverImage, ...rest }) =>
    api.put(`/listings/${id}`, {
      ...rest,
      type: 'spare-part',
      section: 'spare-parts',
      coverImage,
    }),

  remove: (id) => api.delete(`/listings/${id}`),
};