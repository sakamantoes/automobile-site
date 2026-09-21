import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['gallery', 'new-arrivals', 'spare-parts'],
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    make: String,
    model: String,
    year: String,
    trim: String,
    category: String,
    subcategory: String,
    brand: String,
    description: String,
    fullDescription: String,
    price: String,
    location: String,
    status: String,
    grade: String,
    color: String,
    transmission: String,
    fuel: String,
    mileage: String,
    compatibility: String,
    rating: { type: Number, default: 4.8 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Listing', listingSchema);