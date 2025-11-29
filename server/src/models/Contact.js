// server/src/models/Contact.js
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    message: { type: String, required: true },

    // optional: from which property detail page it came
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      default: null,
    },

    // for admin view
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Contact = mongoose.model('Contact', ContactSchema);
export default Contact;
