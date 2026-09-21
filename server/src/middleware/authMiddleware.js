import jwt from 'jsonwebtoken';
import { envConfig } from '../config/envConfig.js';

export const requireAdmin = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    req.admin = decoded; // { id, role: 'admin', iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};