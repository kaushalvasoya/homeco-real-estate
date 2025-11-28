// server/src/routes/contact.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

// ESM helpers for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data folder and JSON file path
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Ensure folder and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, '[]', 'utf8');
}

// POST /api/contact - save contact message
router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, msg: 'name, email and message are required' });
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      return res.status(400).json({ ok: false, msg: 'invalid email' });
    }

    const record = {
      id: 'c_' + Date.now(),
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
      createdAt: new Date().toISOString()
    };

    const raw = fs.readFileSync(CONTACTS_FILE, 'utf8') || '[]';
    const arr = JSON.parse(raw);
    arr.unshift(record);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(arr, null, 2), 'utf8');

    return res.json({ ok: true, msg: 'Message saved', record });
  } catch (err) {
    console.error('contact route error', err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// Optional: GET /api/contact to view all saved messages in JSON
router.get('/', (req, res) => {
  try {
    const raw = fs.readFileSync(CONTACTS_FILE, 'utf8') || '[]';
    const arr = JSON.parse(raw);
    return res.json({ ok: true, items: arr });
  } catch (err) {
    console.error('contact list error', err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

export default router;
