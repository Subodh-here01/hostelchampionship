require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Team = require('./models/Team');
const Match = require('./models/Match');
const Photo = require('./models/Photo');
const Admin = require('./models/Admin');
const Venue = require('./models/Venue');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostel_championship';

async function seedDB() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB. Purging existing database tables...');

    // Clear old data
    await Team.deleteMany({});
    await Match.deleteMany({});
    await Photo.deleteMany({});
    await Admin.deleteMany({});
    await Venue.deleteMany({});

    console.log('Creating Default Administrator account...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('AdminPassword123', salt);

    const defaultAdmin = new Admin({
      name: 'System Admin',
      email: 'hostelchampionship@gmail.com',
      passwordHash,
      role: 'admin'
    });
    await defaultAdmin.save();

    console.log('=========================================');
    console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Account Seeded:');
    console.log('  Email:    hostelchampionship@gmail.com');
    console.log('  Password: AdminPassword123');
    console.log('=========================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDB();
