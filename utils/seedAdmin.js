const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const seedAdmin = async () => {
  try {

    const mongoURI = process.env.MONGODB_URI
    await mongoose.connect(mongoURI);
    
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@theinsightium.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists', process.env.MONGO_URI);
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@theinsightium.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      profile: {
        bio: 'System Administrator'
      }
    });

    // Create editor user
    const editorUser = await User.create({
      name: 'Editor User',
      email: 'editor@theinsightium.com',
      password: 'editor123',
      role: 'editor',
      isActive: true,
      profile: {
        bio: 'Content Editor'
      }
    });

    console.log('Admin and Editor users created successfully:');
    console.log('Admin: admin@theinsightium.com / admin123');
    console.log('Editor: editor@theinsightium.com / editor123');

  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    mongoose.disconnect();
  }
};

// Run if called directly
if (require.main === module) {
  seedAdmin();
}

module.exports = seedAdmin;