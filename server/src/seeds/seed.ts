import bcrypt from 'bcrypt';
import User from '../models/User.js';
import fs from 'fs';

export const seedDatabase = async () => {
  try {
    const userData = JSON.parse(fs.readFileSync('./src/seeds/userData.json', 'utf-8'));

    // Manually hash passwords before inserting
    const hashedUsers = await Promise.all(
      userData.users.map(async (user: any) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    await User.deleteMany({});
    console.log('User collection cleared');

    await User.insertMany(hashedUsers);
    console.log('User data seeded successfully');
  } catch (err) {
    console.error('Error seeding the database:', err);
  }
};