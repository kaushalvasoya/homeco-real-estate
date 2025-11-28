// server/src/models/Property.js
import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema(
  {
    url: String,
    public_id: String,
  },
  { _id: false }
);

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, default: '' },
    price: { type: Number, default: 0 },
    contactPhone: { type: String, default: '' },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    area: { type: Number, default: 0 },
    description: { type: String, default: '' },

    // NEW: category for filtering
    category: {
      type: String,
      enum: ['Commercial', 'House', 'Apartment', 'Land'],
      default: 'house',
    },

    images: [ImageSchema],
  },
  { timestamps: true }
);

const Property = mongoose.model('Property', PropertySchema);
export default Property;
