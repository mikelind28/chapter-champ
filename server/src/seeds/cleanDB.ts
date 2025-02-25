import User from '../models/User.js';

/**
 * Cleans the User collection by removing all user records.
 * Useful for resetting the database during development or testing.
 */
export const cleanDatabase = async (): Promise<void> => {
  try {
    const result = await User.deleteMany({});
    console.log(`Database cleaned successfully. ${result.deletedCount} user(s) removed.`);
  } catch (err) {
    console.error(`Error cleaning the database: ${(err as Error).message}`);
    throw new Error('Failed to clean the database.'); // Propagate error for caller handling
  }
};