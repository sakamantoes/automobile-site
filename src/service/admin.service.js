// src/services/admin.service.js
import { api, tokenStore } from './api.js';

export const adminService = {
  /**
   * Login with access password only (no email).
   * @param {string} password
   * @returns {Promise<{ token: string }>}
   */
  async login(password) {
    const data = await api.post('/auth/login', { password }, { auth: false });
    if (data?.token) tokenStore.set(data.token);
    return data;
  },

  /**
   * Fetch current admin info (validates token).
   */
  async me() {
    return api.get('/auth/me');
  },

  /**
   * Check if a token exists and is valid.
   */
  async isAuthenticated() {
    if (!tokenStore.get()) return false;
    try {
      await api.get('/auth/me');
      return true;
    } catch {
      return false;
    }
  },

  logout() {
    tokenStore.clear();
  },
};