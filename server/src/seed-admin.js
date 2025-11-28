// Run this once to create admin from env ADMIN_EMAIL and ADMIN_PASSWORD
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async ()=> {
    const email = process.env.ADMIN_EMAIL;
    const pass = process.env.ADMIN_PASSWORD;
    if (!email || !pass) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD'); process.exit(1); }
    const exists = await User.findOne({ email });
    if (exists) { console.log('Admin exists'); process.exit(0); }
    const hash = await bcrypt.hash(pass, 10);
    const u = new User({ email, passwordHash: hash });
    await u.save();
    console.log('Admin created:', email);
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });