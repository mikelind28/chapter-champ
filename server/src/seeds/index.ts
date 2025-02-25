import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { seedDatabase } from './seed.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Establishes a connection to the MongoDB database.
 * @returns {Promise<void>}
 * @throws Will exit the process if the connection fails.
 */
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/chapterchamp');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the process on failure
  }
};

/**
 * Main runner function to execute the seeding process.
 * - Connects to the database
 * - Runs the seeding logic
 * - Closes the database connection
 */
const run = async (): Promise<void> => {
  try {
    await connectDB();              // Step 1: Connect to MongoDB
    await seedDatabase();           // Step 2: Seed the database
    await mongoose.connection.close(); // Step 3: Close the connection
    console.log('Database seeded & connection closed');
    process.exit(0);                // Exit successfully
  } catch (error) {
    console.error('Error during seeding process:', error);
    await mongoose.connection.close(); // Ensure the connection closes on error
    process.exit(1);                  // Exit with failure
  }
};

// Execute the seeding process
run();