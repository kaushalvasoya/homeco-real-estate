import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const router = express.Router();
const AdminSchema = new mongoose.Schema({ email:String, password:String });
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

router.post('/create-admin', async (req,res)=>{
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg:'Provide email & password' });
  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ msg:'Admin exists' });
  const hash = await bcrypt.hash(password,12);
  const admin = new Admin({ email, password: hash });
  await admin.save();
  res.json({ msg:'created' });
});

router.post('/login', async (req,res)=>{
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ msg:'Invalid' });
  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return res.status(401).json({ msg:'Invalid' });
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export default router;
