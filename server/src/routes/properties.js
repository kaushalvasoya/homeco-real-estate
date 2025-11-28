// server/src/routes/properties.js
import express from 'express';
import Property from '../models/Property.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = express.Router();
const upload = multer();

/**
 * Helper: upload one buffer to Cloudinary and return { url, public_id }
 */
async function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'realestate' },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/**
 * GET /api/properties
 * Optional query:
 *   - category=house|commercial|apartment|land
 *   - q=search text (title/location)
 */
router.get('/', async (req, res) => {
  try {
    const { category, q } = req.query;
    const filter = {};

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (q) {
      const regex = new RegExp(q, 'i');
      filter.$or = [{ title: regex }, { location: regex }];
    }

    const list = await Property.find(filter)
      .sort('-createdAt')
      .limit(50);

    res.json(list);
  } catch (err) {
    console.error('Get properties error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * POST /api/properties
 * Create property (admin only)
 * Accepts multipart/form-data with fields:
 *  title, location, price, contactPhone, bedrooms, bathrooms, area,
 *  description, category, images[]
 */
router.post('/', auth, upload.array('images'), async (req, res) => {
  try {
    const images = [];

    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploaded = await uploadBufferToCloudinary(file.buffer);
        images.push(uploaded);
      }
    }

    const {
      title,
      location,
      price,
      contactPhone,
      bedrooms,
      bathrooms,
      area,
      description,
      category,
    } = req.body;

    const prop = new Property({
      title,
      location,
      price: Number(price || 0),
      contactPhone,
      bedrooms: Number(bedrooms || 0),
      bathrooms: Number(bathrooms || 0),
      area: Number(area || 0),
      description,
      category: category || 'house',
      images,
    });

    await prop.save();
    res.json(prop);
  } catch (e) {
    console.error('Upload error', e);
    res.status(500).json({ msg: 'Upload error', error: e.message });
  }
});

/**
 * GET /api/properties/:id
 * Single property
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prop = await Property.findById(id);
    if (!prop) {
      return res.status(404).json({ msg: 'Property not found' });
    }
    res.json(prop);
  } catch (err) {
    console.error('Get property error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * PUT /api/properties/:id
 * Update property (admin only)
 * - You can send JSON (no images) OR multipart with new images
 * - New images are appended to existing ones for now
 */
router.put('/:id', auth, upload.array('images'), async (req, res) => {
  try {
    const { id } = req.params;
    const prop = await Property.findById(id);
    if (!prop) {
      return res.status(404).json({ msg: 'Property not found' });
    }

    const {
      title,
      location,
      price,
      contactPhone,
      bedrooms,
      bathrooms,
      area,
      description,
      category,
    } = req.body;

    if (title !== undefined) prop.title = title;
    if (location !== undefined) prop.location = location;
    if (price !== undefined) prop.price = Number(price || 0);
    if (contactPhone !== undefined) prop.contactPhone = contactPhone;
    if (bedrooms !== undefined) prop.bedrooms = Number(bedrooms || 0);
    if (bathrooms !== undefined) prop.bathrooms = Number(bathrooms || 0);
    if (area !== undefined) prop.area = Number(area || 0);
    if (description !== undefined) prop.description = description;
    if (category !== undefined) prop.category = category;

    // optional new images
    if (req.files && req.files.length) {
      for (const file of req.files) {
        const uploaded = await uploadBufferToCloudinary(file.buffer);
        prop.images.push(uploaded);
      }
    }

    await prop.save();
    res.json(prop);
  } catch (err) {
    console.error('Update property error', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

/**
 * DELETE /api/properties/:id
 * Delete property + images (admin only)
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const prop = await Property.findById(id);
    if (!prop) return res.status(404).json({ msg: 'Property not found' });

    // delete images from Cloudinary (if any)
    if (prop.images && prop.images.length) {
      for (const img of prop.images) {
        try {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        } catch (err) {
          console.error(
            'Cloudinary delete error for',
            img.public_id,
            err.message
          );
        }
      }
    }

    await Property.findByIdAndDelete(id);
    return res.json({ msg: 'Property deleted', id });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ msg: 'Server error', error: err.message });
  }
});

export default router;
