import mongoose from 'mongoose';
import Listing from '../models/Listing.js';
import { deleteManyFromCloudinary } from '../config/cloudinary.js';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const sanitizeImage = (img) => {
  if (!img || !img.url || !img.publicId) return null;
  return {
    url: img.url,
    publicId: img.publicId,
    alt: img.alt || '',
    label: img.label || '',
  };
};

const sanitizeGallery = (group) => {
  if (!group || !group.label) return null;
  const images = (group.images || []).map(sanitizeImage).filter(Boolean);
  if (!images.length) return null;
  return { label: group.label, images };
};

const buildListingPayload = (body) => {
  const coverImage = sanitizeImage(body.coverImage);
  if (!coverImage) throw new Error('coverImage (url + publicId) is required');

  const subImages = (body.subImages || []).map(sanitizeImage).filter(Boolean);
  const galleries = (body.galleries || []).map(sanitizeGallery).filter(Boolean);

  return {
    type: body.type,
    section: body.section,
    name: body.name,
    brand: body.brand || '',
    category: body.category || '',
    subcategory: body.subcategory || '',
    description: body.description || '',
    fullDescription: body.fullDescription || '',
    make: body.make || '',
    model: body.model || '',
    trim: body.trim || '',
    year: body.year || '',
    color: body.color || '',
    transmission: body.transmission || '',
    fuel: body.fuel || '',
    mileage: Number(body.mileage) || 0,
    price: body.price || '',
    location: body.location || '',
    status: body.status || '',
    grade: body.grade || '',
    coverImage,
    subImages,
    galleries,
    inStock: body.inStock !== false,
    featured: !!body.featured,
    newArrival: !!body.newArrival,
    rating: Number(body.rating) || 4.8,
  };
};

/* ------------------------------------------------------------------ */
/*  Controllers                                                        */
/* ------------------------------------------------------------------ */

/**
 * GET /api/listings
 * Public — used by the homepage, gallery, spare-parts page.
 * Query params: ?section=gallery | new-arrivals | spare-parts
 *               ?type=car | spare-part
 *               ?limit=6
 */
export const getListings = async (req, res, next) => {
  try {
    const { section, type, limit } = req.query;
    const filter = {};
    if (section) filter.section = section;
    if (type) filter.type = type;

    const query = Listing.find(filter).sort({ createdAt: -1 });
    if (limit) query.limit(Number(limit));

    const listings = await query.lean();
    res.json(listings);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/listings/:id
 */
export const getListingById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const listing = await Listing.findById(req.params.id).lean();
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/listings  (admin only)
 * Body: { type, section, name, ..., coverImage, subImages, galleries }
 */
export const createListing = async (req, res, next) => {
  try {
    const payload = buildListingPayload(req.body);
    const listing = await Listing.create(payload);
    res.status(201).json(listing);
  } catch (err) {
    if (err.message.includes('coverImage')) {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

/**
 * PUT /api/listings/:id  (admin only)
 * Replaces the whole doc. Images removed here are also deleted from Cloudinary.
 */
export const updateListing = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const existing = await Listing.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Listing not found' });

    const payload = buildListingPayload({ ...existing.toObject(), ...req.body });

    // Find publicIds that were present before but NOT in the new payload
    const oldIds = existing.allPublicIds();
    const newIds = new Set();
    if (payload.coverImage?.publicId) newIds.add(payload.coverImage.publicId);
    payload.subImages?.forEach((i) => newIds.add(i.publicId));
    payload.galleries?.forEach((g) =>
      g.images.forEach((i) => newIds.add(i.publicId))
    );

    const removed = oldIds.filter((id) => !newIds.has(id));
    if (removed.length) await deleteManyFromCloudinary(removed);

    Object.assign(existing, payload);
    await existing.save();

    res.json(existing);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/listings/:id  (admin only)
 * Deletes from Mongo AND from Cloudinary.
 */
export const deleteListing = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const publicIds = listing.allPublicIds();

    await listing.deleteOne();
    // Fire and forget — don't block the response on Cloudinary
    deleteManyFromCloudinary(publicIds);

    res.json({ message: 'Listing deleted', deletedImages: publicIds.length });
  } catch (err) {
    next(err);
  }
};