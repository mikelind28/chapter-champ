import bcrypt from 'bcrypt';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

/**
 * Seeds the database with user data from a JSON file.
 * - Reads user data from `userData.json`
 * - Hashes passwords before insertion
 * - Clears existing user data before seeding
 * 
 * @async
 * @function seedDatabase
 * @throws Will log and handle any errors during the seeding process.
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    const filePath = path.resolve('./src/seeds/userData.json');
    const userData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (!userData || !Array.isArray(userData.users)) {
      console.error('Invalid or missing user data in userData.json');
      return;
    }

    console.log(`Found ${userData.users.length} users. Preparing to seed...`);

    // Hash passwords before inserting
    const hashedUsers = await Promise.all(
      userData.users.map(async (user: any) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // Clear existing user data
    await User.deleteMany({});
    console.log('User collection cleared');

    // Insert new user data
    await User.insertMany(hashedUsers);
    console.log('User data seeded successfully');
  } catch (err) {
    console.error('Error seeding the database:', err);
  }
};