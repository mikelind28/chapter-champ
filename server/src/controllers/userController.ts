import { BookStatus } from "types/readingStatus.js";
import {
  getUserById,
  createUser,
  loginUser,
  removeUser,
  saveBookToLibrary,
  updateBookStatusInLibrary,
  removeBookFromLibrary,
} from "../services/userService.js";
import User from "../models/User.js";
import { createError } from "../middleware/errorHandler.js";

/**
 * Ensures the current user is authenticated.
 * @param {Object} context - GraphQL context (includes user info).
 * @throws {Error} If the user is not logged in.
 */
const ensureAuthenticated = (context: any) => {
  if (!context.user) throw createError("You must be logged in.", 401);
};

/**
 * Ensures the current user has admin privileges.
 * @param {Object} context - GraphQL context (includes user info).
 * @throws {Error} If the user is not an admin.
 */
const ensureAdmin = (context: any) => {
  ensureAuthenticated(context);
  if (!context.user.isAdmin)
    throw createError("Admin privileges required.", 403);
};

/**
 * Retrieves the currently authenticated user.
 * @param {Object} context - GraphQL context (includes user info).
 * @returns {Promise<Object>} - User data without sensitive info.
 */
export const getCurrentUser = async (context: any) => {
  try {
    ensureAuthenticated(context);
    return await getUserById(context.user._id);
  } catch (error: any) {
    throw createError(`Error fetching user: ${error.message}`, 500);
  }
};

/**
 * Retrieves all users (Admin-only).
 * @param {Object} context - GraphQL context (includes user info).
 * @returns {Promise<Array>} - Array of user objects.
 */
export const getUsers = async (context: any) => {
  try {
    ensureAdmin(context);
    return await User.find();
  } catch (error: any) {
    throw createError(`Error fetching users: ${error.message}`, 500);
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
    return await createUser(username, email, password);
  } catch (error: any) {
    throw createError(`Error registering user: ${error.message}`, 400);
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
    return await loginUser(email, password);
  } catch (error: any) {
    throw createError(`Login failed: ${error.message}`, 401);
  }
};

/**
 * Updates a user's username and email.
 * @param {Object} context - GraphQL context (includes user info).
 * @param {string} username - The new username.
 * @param {string} email - The new email.
 * @returns {Promise<Object>} - Updated user object.
 */
export const updateUserDetails = async (
  context: any,
  username: string,
  email: string
) => {
  try {
    ensureAuthenticated(context);
    const updatedUser = await User.findByIdAndUpdate(
      context.user._id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!updatedUser) throw createError("User not found or update failed.", 404);
    return updatedUser;
  } catch (error: any) {
    throw createError(`Error updating user details: ${error.message}`, 500);
  }
};

/**
 * Deletes a user (Admin-only).
 * @param {Object} context - GraphQL context (includes user info).
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<Object>} - Deleted user.
 */
export const deleteUser = async (context: any, userId: string) => {
  try {
    ensureAdmin(context);
    return await removeUser(userId);
  } catch (error: any) {
    throw createError(`Error deleting user: ${error.message}`, 500);
  }
};

/**
 * Saves a book to the user's library.
 * @param {Object} context - GraphQL context (includes user info).
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
    return await saveBookToLibrary(context.user._id, input, status);
  } catch (error: any) {
    throw createError(`Error saving book: ${error.message}`, 500);
  }
};

/**
 * Updates book status in the user's library.
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
    return await updateBookStatusInLibrary(context.user._id, bookId, status);
  } catch (error: any) {
    throw createError(`Error updating book status: ${error.message}`, 500);
  }
};

/**
 * Removes a book from the user's library.
 * @param {Object} context - GraphQL context.
 * @param {string} bookId - Book ID.
 * @returns {Promise<Object>} - Updated user data.
 */
export const removeBook = async (context: any, bookId: string) => {
  try {
    ensureAuthenticated(context);
    return await removeBookFromLibrary(context.user._id, bookId);
  } catch (error: any) {
    throw createError(`Error removing book: ${error.message}`, 500);
  }
};

/**
 * Retrieves all users (Admin-only). Future use.
 * @param {Object} context - GraphQL context (includes user info).
 * @returns {Promise<Array>} - Array of all user data.
 */
export const getAllUsers = async (context: any) => {
  try {
    ensureAdmin(context);
    const users = await User.find({}).select("-__v -password");
    return users;
  } catch (error: any) {
    throw createError(`Error retrieving all users: ${error.message}`, 500);
  }
};

/**
 * Promotes a user to admin (Admin-only). Future use.
 * @param {Object} context - GraphQL context.
 * @param {string} userId - The ID of the user to promote.
 * @returns {Promise<Object>} - Updated user with admin privileges.
 */
export const promoteUserToAdmin = async (context: any, userId: string) => {
  try {
    ensureAdmin(context);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
    ).select("-__v -password");

    if (!updatedUser) throw createError("User not found.", 404);
    return updatedUser;
  } catch (error: any) {
    throw createError(`Error promoting user to admin: ${error.message}`, 500);
  }
};