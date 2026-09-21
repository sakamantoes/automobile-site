import app from './app.js';
import mongoose from 'mongoose';
import { envConfig } from './config/envConfig.js';
import connectDB from './config/dbConfig.js';

const PORT = envConfig.PORT;

const start = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`AutoMobile Server running on http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`\n${signal} received, shutting down...`);
    server.close(async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

start();