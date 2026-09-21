import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import Listing from './models/Listing.js';
import { requireAdmin } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()) : []),
];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const validUser = username === process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD && await bcrypt.compare(password || '', await bcrypt.hash(process.env.ADMIN_PASSWORD, 10));

  if (!validUser || !validPassword) return res.status(401).json({ message: 'Invalid admin credentials' });

  const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

app.get('/api/listings', async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  const listings = await Listing.find(filter).sort({ createdAt: -1 }).lean();
  res.json(listings);
});

app.post('/api/listings', requireAdmin, async (req, res) => {
  if (!req.body.imageUrl || !req.body.imageUrl.startsWith('https://res.cloudinary.com/')) {
    return res.status(400).json({ message: 'A valid Cloudinary image URL is required' });
  }
  if (!['gallery', 'new-arrivals', 'spare-parts'].includes(req.body.type)) {
    return res.status(400).json({ message: 'Invalid listing type' });
  }

  const listing = await Listing.create({
    ...req.body,
    rating: req.body.rating ? Number(req.body.rating) : undefined,
    inStock: req.body.inStock !== 'false',
    imageUrl: req.body.imageUrl,
  });
  res.status(201).json(listing);
});

app.delete('/api/listings/:id', requireAdmin, async (req, res) => {
  const listing = await Listing.findByIdAndDelete(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.status(204).end();
});

app.use((error, _req, res, _next) => {
  res.status(400).json({ message: error.message || 'Request failed' });
}); 


const port = process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => app.listen(port, () => console.log(`API running on http://localhost:${port}`)))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });