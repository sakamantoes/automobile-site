import jwt from 'jsonwebtoken';
import Admin from '../model/Admin.js';
import { envConfig } from '../config/envConfig.js';

const signToken = (id) =>
  jwt.sign({ id, role: 'admin' }, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN,
  });

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(500).json({ message: 'Admin not initialized' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid access password' });
    }

    const token = signToken(admin._id);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  res.json({ role: 'admin', id: req.admin.id });
};