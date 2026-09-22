import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.get('/', (req, res) => {
  res.json({ message: 'AutoMobile API is running' });
});

//main route
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

export default app;
