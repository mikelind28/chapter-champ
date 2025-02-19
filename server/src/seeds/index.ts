import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from './seed.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const run = async () => {
  await connectDB();

  await seedDatabase();

  mongoose.connection.close();
  console.log('Database connection closed');
};

run();