// src/server.js
import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/dbConfig.js';

// Connect once (module-level). Serverless will reuse the connection
// across warm invocations of the same function instance.
let connectionPromise = null;

const ensureDb = () => {
  if (!connectionPromise) connectionPromise = connectDB();
  return connectionPromise;
};

// If running locally (not on Vercel), listen on a port.
if (!process.env.VERCEL) {
  (async () => {
    await ensureDb();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })();
}

// Export for Vercel serverless
export default async function handler(req, res) {
  await ensureDb();
  return app(req, res);
}