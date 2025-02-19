import User from '../models/User.js';

export const cleanDatabase = async () => {
  try {
    await User.deleteMany({});
    console.log('Database cleaned successfully');
  } catch (err) {
    console.error('Error cleaning the database:', err);
  }
};