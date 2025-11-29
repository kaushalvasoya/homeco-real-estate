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

// helpers
function loadContacts() {
  const raw = fs.readFileSync(CONTACTS_FILE, 'utf8') || '[]';
  return JSON.parse(raw);
}

function saveContacts(arr) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

// POST /api/contact  save contact message
router.post('/', (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ ok: false, msg: 'name, email and message are required' });
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
      createdAt: new Date().toISOString(),
      read: false, // new field
    };

    const arr = loadContacts();
    arr.unshift(record);
    saveContacts(arr);

    return res.json({ ok: true, msg: 'Message saved', record });
  } catch (err) {
    console.error('contact route error', err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// GET /api/contact  list messages
// query: onlyUnread=true to filter unread
router.get('/', (req, res) => {
  try {
    const onlyUnread =
      String(req.query.onlyUnread || '').toLowerCase() === 'true';

    let arr = loadContacts();
    if (onlyUnread) {
      arr = arr.filter(c => !c.read);
    }

    return res.json({ ok: true, items: arr });
  } catch (err) {
    console.error('contact list error', err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// PATCH /api/contact/:id/read  mark read/unread
// body: { read: true | false }
router.patch('/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body || {};

    if (typeof read !== 'boolean') {
      return res
        .status(400)
        .json({ ok: false, msg: 'read must be boolean (true/false)' });
    }

    const arr = loadContacts();
    const idx = arr.findIndex(c => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, msg: 'Message not found' });
    }

    arr[idx].read = read;
    saveContacts(arr);

    return res.json({ ok: true, item: arr[idx] });
  } catch (err) {
    console.error('contact read toggle error', err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

// DELETE /api/contact/:id  delete message
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    const arr = loadContacts();
    const idx = arr.findIndex(c => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, msg: 'Message not found' });
    }

    const [removed] = arr.splice(idx, 1);
    saveContacts(arr);

    return res.json({ ok: true, msg: 'Message deleted', item: removed });
  } catch (err) {
    console.error('contact delete error', err);
    return res.status(500).json({ ok: false, msg: 'Server error' });
  }
});

export default router;
