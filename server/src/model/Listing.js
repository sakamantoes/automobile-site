import mongoose from 'mongoose';

/* ---------- Sub-schemas ---------- */

// An image always carries url + publicId (Cloudinary identifier)
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, default: '' },
    // label like "interior", "engine", "front", "rear" — used to group
    label: { type: String, default: '' },
  },
  { _id: false }
);

// A sub-gallery = a labeled group of images (e.g. Interior, Engine)
const galleryGroupSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "Interior"
    images: { type: [imageSchema], default: [] },
  },
  { _id: false }
);

/* ---------- Main schema ---------- */

const listingSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['car', 'spare-part'],
      required: true,
      index: true,
    },

    // Placement on the site
    section: {
      type: String,
      enum: ['gallery', 'new-arrivals', 'spare-parts'],
      required: true,
      index: true,
    },

    // ----- shared -----
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true, default: '' }, // e.g. Toyota / NGK
    category: { type: String, trim: true, default: '' }, // for spare parts
    subcategory: { type: String, trim: true, default: '' },
    description: { type: String, default: '' },
    fullDescription: { type: String, default: '' },

    // ----- car-specific -----
    make: { type: String, trim: true, default: '' },
    model: { type: String, trim: true, default: '' },
    trim: { type: String, trim: true, default: '' },
    year: { type: String, default: '' },
    color: { type: String, default: '' },
    transmission: { type: String, default: '' },
    fuel: { type: String, default: '' },
    mileage: { type: Number, default: 0 },
    price: { type: String, default: '' }, // string so "17M" works
    location: { type: String, default: '' },
    status: { type: String, default: '' }, // e.g. "Toks Standard"
    grade: { type: String, default: '' },

    // ----- images -----
    coverImage: { type: imageSchema, required: true }, // main thumbnail
    subImages: { type: [imageSchema], default: [] }, // simple flat list
    galleries: { type: [galleryGroupSchema], default: [] }, // labeled groups

    // ----- flags -----
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    rating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
);

// Text index for search
listingSchema.index({ name: 'text', brand: 'text', make: 'text', model: 'text' });

/* ---------- Helper: collect every publicId on this doc ---------- */

listingSchema.methods.allPublicIds = function () {
  const ids = [];
  if (this.coverImage?.publicId) ids.push(this.coverImage.publicId);
  this.subImages?.forEach((img) => img.publicId && ids.push(img.publicId));
  this.galleries?.forEach((g) =>
    g.images?.forEach((img) => img.publicId && ids.push(img.publicId))
  );
  return ids;
};

export default mongoose.model('Listing', listingSchema);