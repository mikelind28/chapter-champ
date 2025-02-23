import { User as UserModel } from "../models/index.js";
import { signToken } from "../utils/auth.js";
import { AuthenticationError } from "apollo-server-express";
import {
  mapGraphQLStatusToMongoose,
  mapMongooseStatusToGraphQL,
  BookStatus,
} from "../types/readingStatus.js";

/**
 * Converts the savedBooks status field from Mongoose format to GraphQL enum.
 * 
 * @function convertUserStatusToGraphQL
 * @param {Object} user - The user object from the database.
 * @returns {Object} The user object with GraphQL-compatible status values.
 */
const convertUserStatusToGraphQL = (user: any) => {
  if (user?.savedBooks) {
    user.savedBooks = user.savedBooks.map((book: any) => ({
      ...book,
      status: mapMongooseStatusToGraphQL(book.status),
    }));
  }
  return user;
};

/**
 * Retrieves a user by ID, excluding sensitive fields, and converts status fields.
 *
 * @function getUserById
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object>} The user object with GraphQL-compatible status.
 */
export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-__v -password").lean();
  if (!user) throw new Error("User not found.");
  return convertUserStatusToGraphQL(user);
};

/**
 * Finds a user by their email address.
 *
 * @function findUserByEmail
 * @param {string} email - The user's email address.
 * @returns {Promise<Object|null>} The user object or null if not found.
 */
export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email }).lean();
  return user ? convertUserStatusToGraphQL(user) : null;
};

/**
 * Creates a new user and returns an authentication token with user details.
 *
 * @function createUser
 * @param {string} username - Desired username.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<{ token: string; user: Object }>} JWT and user details.
 */
export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  const user = await UserModel.create({ username, email, password });
  const token = signToken(user.email, user._id, user.isAdmin);
  return { token, user: convertUserStatusToGraphQL(user.toObject()) };
};

/**
 * Authenticates a user and returns a JWT on success.
 *
 * @function loginUser
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ token: string; user: Object }>} JWT and user details.
 * @throws {AuthenticationError} If authentication fails.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new AuthenticationError("Can't find this user");

  const isValid = await user.isCorrectPassword(password);
  if (!isValid) throw new AuthenticationError("Wrong password!");

  const token = signToken(user.email, user._id, user.isAdmin);
  return { token, user: convertUserStatusToGraphQL(user.toObject()) };
};

/**
 * Saves a book to the user's library with the specified reading status.
 * Prevents duplicates using `$addToSet`.
 *
 * @function saveBookToLibrary
 * @param {string} userId - User's ID.
 * @param {Object} bookData - Book details.
 * @param {BookStatus} status - Reading status (GraphQL enum).
 * @returns {Promise<Object>} Updated user with GraphQL-compatible status.
 * @throws {Error} If the user is not found or duplicate book exists.
 */
export const saveBookToLibrary = async (
  userId: string,
  bookData: any,
  status: BookStatus
) => {
  const mappedStatus = mapGraphQLStatusToMongoose(status);

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: userId, "savedBooks.bookDetails.id": { $ne: bookData.id } },
    { $addToSet: { savedBooks: { bookDetails: bookData, status: mappedStatus } } },
    { new: true, runValidators: true }
  ).lean();

  if (!updatedUser) {
    throw new Error("Book already exists in the user's library or user not found.");
  }

  return convertUserStatusToGraphQL(updatedUser);
};

/**
 * Updates the reading status of a saved book.
 *
 * @function updateBookStatusInLibrary
 * @param {string} userId - User's ID.
 * @param {string} bookId - Book's ID.
 * @param {BookStatus} newStatus - New reading status (GraphQL enum).
 * @returns {Promise<Object>} Updated user with GraphQL-compatible status.
 * @throws {Error} If user or book not found.
 */
export const updateBookStatusInLibrary = async (
  userId: string,
  bookId: string,
  newStatus: BookStatus
) => {
  const mappedStatus = mapGraphQLStatusToMongoose(newStatus);

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: userId, "savedBooks.bookDetails.id": bookId },
    { $set: { "savedBooks.$.status": mappedStatus } },
    { new: true }
  ).lean();

  if (!updatedUser) {
    throw new Error("Book not found in user's library or user not found.");
  }

  return convertUserStatusToGraphQL(updatedUser);
};

/**
 * Removes a book from the user's library by its ID.
 *
 * @function removeBookFromLibrary
 * @param {string} userId - User's ID.
 * @param {string} bookId - Book's ID to remove.
 * @returns {Promise<Object>} Updated user without the removed book.
 * @throws {Error} If user not found.
 */
export const removeBookFromLibrary = async (userId: string, bookId: string) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { savedBooks: { "bookDetails.id": bookId } } },
    { new: true }
  ).lean();

  if (!updatedUser) {
    throw new Error("User not found or book not in library.");
  }

  return convertUserStatusToGraphQL(updatedUser);
};
