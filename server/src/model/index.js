import Admin from './Admin.js';
import { envConfig } from '../config/envConfig.js';

export const ensureAdminExists = async () => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    await Admin.create({ password: envConfig.ADMIN_PASSWORD });
    console.log('👤 Default admin created from ADMIN_PASSWORD');
  }
};