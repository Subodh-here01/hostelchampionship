const express = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Admin Password Login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin', email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ message: 'Internal Server Error during admin login' });
  }
});

// Admin Account Creation (Developer Setup Route)
router.post('/create-admin', async (req, res) => {
  const adminSecretHeader = req.headers['x-admin-secret'];
  const envSecret = process.env.ADMIN_SECRET || 'dev_secret';

  if (!adminSecretHeader || adminSecretHeader !== envSecret) {
    return res.status(403).json({ message: 'Unauthorized: Invalid developer secret' });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      passwordHash,
      role: 'admin'
    });

    await newAdmin.save();
    return res.status(201).json({ message: 'Admin account registered successfully' });
  } catch (error) {
    console.error('Error creating admin account:', error);
    return res.status(500).json({ message: 'Internal Server Error during admin generation' });
  }
});

module.exports = router;
