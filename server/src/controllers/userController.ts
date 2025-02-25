import { BookStatus } from "types/readingStatus.js";
import {
  getUserById,
  createUser,
  loginUser,
  saveBookToLibrary,
  updateBookStatusInLibrary,
  removeBookFromLibrary,
} from "../services/userService.js";
import { AuthenticationError, } from "apollo-server-express";

/**
 * Ensures the current user is authenticated.
 * @param {Object} context - GraphQL context (includes user info).
 * @throws {AuthenticationError} If the user is not logged in.
 */
const ensureAuthenticated = (context: any) => {
  if (!context.user) {
    console.error("[AUTH] Authentication failed: User not logged in.");
    throw new AuthenticationError("You must be logged in.");
  }
};

/**
 * Retrieves the currently authenticated user.
 * @param {Object} context - GraphQL context (includes user info).
 * @returns {Promise<Object>} - User data without sensitive info.
 */
export const getCurrentUser = async (context: any) => {
  try {
    ensureAuthenticated(context);
    console.log(`[USER] Fetching current user: ${context.user._id}`);
    return await getUserById(context.user._id);
  } catch (error) {
    console.error("[USER] Error fetching current user:", error);
    throw new Error("Failed to fetch user data.");
  }
};

/**
 * Registers a new user and returns authentication data.
 * @param {string} username - New user's username.
 * @param {string} email - New user's email.
 * @param {string} password - New user's password.
 * @returns {Promise<Object>} - JWT and user data.
 */
export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    console.log(`[REGISTER] Registering user: ${username}`);
    return await createUser(username, email, password);
  } catch (error) {
    console.error("[REGISTER] Error during registration:", error);
    throw new Error("User registration failed.");
  }
};

/**
 * Authenticates a user and returns token + user data.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} - JWT and user data.
 */
export const authenticateUser = async (email: string, password: string) => {
  try {
    console.log(`[LOGIN] Authenticating user: ${email}`);
    return await loginUser(email, password);
  } catch (error) {
    console.error("[LOGIN] Authentication failed:", error);
    throw new AuthenticationError("Invalid email or password.");
  }
};

/**
 * Saves a book to user's library.
 * @param {Object} context - GraphQL context (user info).
 * @param {Object} input - Book details.
 * @param {string} status - Reading status.
 * @returns {Promise<Object>} - Updated user data.
 */
export const saveBook = async (
  context: any,
  input: any,
  status: BookStatus
) => {
  try {
    ensureAuthenticated(context);
    console.log(
      `[BOOK] Saving book ${input.title} for user: ${context.user._id}`
    );
    return await saveBookToLibrary(context.user._id, input, status);
  } catch (error) {
    console.error("[BOOK] Error saving book:", error);
    throw new Error("Failed to save book.");
  }
};

/**
 * Updates book status in user's library.
 * @param {Object} context - GraphQL context.
 * @param {string} bookId - Book ID.
 * @param {string} status - New status.
 * @returns {Promise<Object>} - Updated user data.
 */
export const updateBookStatus = async (
  context: any,
  bookId: string,
  status: BookStatus
) => {
  try {
    ensureAuthenticated(context);
    console.log(`[BOOK] Updating status of book ${bookId} to ${status}`);
    return await updateBookStatusInLibrary(context.user._id, bookId, status);
  } catch (error) {
    console.error("[BOOK] Error updating book status:", error);
    throw new Error("Failed to update book status.");
  }
};

/**
 * Removes a book from user's library.
 * @param {Object} context - GraphQL context.
 * @param {string} bookId - Book ID.
 * @returns {Promise<Object>} - Updated user data.
 */
export const removeBook = async (context: any, bookId: string) => {
  try {
    ensureAuthenticated(context);
    console.log(
      `[BOOK] Removing book ${bookId} from user: ${context.user._id}`
    );
    return await removeBookFromLibrary(context.user._id, bookId);
  } catch (error) {
    console.error("[BOOK] Error removing book:", error);
    throw new Error("Failed to remove book.");
  }
};
