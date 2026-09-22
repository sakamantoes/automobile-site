import mongoose from 'mongoose';
import { envConfig } from './envConfig.js';
import { ensureAdminExists } from '../model/index.js';

let listenersBound = false;

/**
 * Bind connection lifecycle listeners exactly once.
 */
const bindListeners = () => {
  if (listenersBound) return;
  listenersBound = true;

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
  });
};

/**
 * Connect to MongoDB.
 * - Safe to call multiple times (serverless cold starts reuse the connection).
 * - Throws on failure so Vercel returns a 500 instead of killing the runtime.
 */
const connectDB = async () => {
  // Reuse existing connection if already open
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(envConfig.DB_URL, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    bindListeners();
    await ensureAdminExists();

    return conn;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    throw err; // do NOT process.exit here
  }
};

export default connectDB;
export { connectDB };