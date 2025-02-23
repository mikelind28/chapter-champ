import { BookStatus } from "types/readingStatus.js";
import {
    getUserById,
    createUser,
    loginUser,
    saveBookToLibrary,
    updateBookStatusInLibrary,
    removeBookFromLibrary,
  } from "../services/userService.js";
  import { AuthenticationError, ForbiddenError } from "apollo-server-express";
  
  /**
   * Ensures the current user is authenticated.
   * @param {Object} context - GraphQL context (includes user info).
   * @throws {AuthenticationError} If the user is not logged in.
   */
  const ensureAuthenticated = (context: any) => {
    if (!context.user) throw new AuthenticationError("You must be logged in.");
  };
  
  /**
   * Ensures the current user has admin privileges.
   * @param {Object} context - GraphQL context (includes user info).
   * @throws {ForbiddenError} If the user is not an admin.
   */
  const ensureAdmin = (context: any) => {
    ensureAuthenticated(context);
    if (!context.user.isAdmin) throw new ForbiddenError("Admin privileges required.");
  };
  
  /**
   * Retrieves the currently authenticated user.
   * @param {Object} context - GraphQL context (includes user info).
   * @returns {Promise<Object>} - User data without sensitive info.
   */
  export const getCurrentUser = async (context: any) => {
    ensureAuthenticated(context);
    return await getUserById(context.user._id);
  };
  
  /**
   * Registers a new user and returns authentication data.
   * @param {string} username - New user's username.
   * @param {string} email - New user's email.
   * @param {string} password - New user's password.
   * @returns {Promise<Object>} - JWT and user data.
   */
  export const registerUser = async (username: string, email: string, password: string) => {
    return await createUser(username, email, password);
  };
  
  /**
   * Authenticates a user and returns token + user data.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<Object>} - JWT and user data.
   */
  export const authenticateUser = async (email: string, password: string) => {
    return await loginUser(email, password);
  };
  
  /**
   * Saves a book to user's library.
   * @param {Object} context - GraphQL context (user info).
   * @param {Object} input - Book details.
   * @param {string} status - Reading status.
   * @returns {Promise<Object>} - Updated user data.
   */
  export const saveBook = async (context: any, input: any, status: BookStatus) => {
    ensureAuthenticated(context);
    return await saveBookToLibrary(context.user._id, input, status);
  };
  
  /**
   * Updates book status in user's library.
   * @param {Object} context - GraphQL context.
   * @param {string} bookId - Book ID.
   * @param {string} status - New status.
   * @returns {Promise<Object>} - Updated user data.
   */
  export const updateBookStatus = async (context: any, bookId: string, status: BookStatus) => {
    ensureAuthenticated(context);
    return await updateBookStatusInLibrary(context.user._id, bookId, status);
  };
  
  /**
   * Removes a book from user's library.
   * @param {Object} context - GraphQL context.
   * @param {string} bookId - Book ID.
   * @returns {Promise<Object>} - Updated user data.
   */
  export const removeBook = async (context: any, bookId: string) => {
    ensureAuthenticated(context);
    return await removeBookFromLibrary(context.user._id, bookId);
  };
  
  /**
   * Admin-only placeholder: Retrieves all users (future use).
   * @param {Object} context - GraphQL context (user info).
   * @returns {Promise<Array>} - Array of all user data.
   * @throws {ForbiddenError} If the user is not an admin.
   */
  export const getAllUsers = async (context: any) => {
    ensureAdmin(context); // Only admins can use this
    const { User } = await import("../models/index.js"); // Lazy import to avoid circular dependency
    return await User.find({}).select("-__v -password");
  };
  
  /**
   * Admin-only placeholder: Promote user to admin (future use).
   * @param {Object} context - GraphQL context.
   * @param {string} userId - The ID of the user to promote.
   * @returns {Promise<Object>} - Updated user with admin privileges.
   * @throws {ForbiddenError} If the requester is not an admin.
   */
  export const promoteUserToAdmin = async (context: any, userId: string) => {
    ensureAdmin(context); // Only admins can promote
  
    const { User } = await import("../models/index.js");
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
    ).select("-__v -password");
  
    if (!updatedUser) throw new Error("User not found.");
    return updatedUser;
  };