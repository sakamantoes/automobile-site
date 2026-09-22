// api/index.js
import 'dotenv/config';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Connect once per cold start; reuse the connection across invocations
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}