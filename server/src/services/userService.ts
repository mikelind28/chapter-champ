import { User as UserModel } from "../models/index.js";
import { signToken } from "../utils/auth.js";
import { createError } from "../middleware/errorHandler.js";
import {
  mapGraphQLStatusToMongoose,
  mapMongooseStatusToGraphQL,
  BookStatus,
} from "../types/readingStatus.js";

/**
 * Converts the savedBooks status field from Mongoose format to GraphQL enum.
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
 * Retrieves a user by ID, excluding sensitive fields.
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<Object>} The user object with GraphQL-compatible status.
 * @throws {Error} If the user is not found.
 */
export const getUserById = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-__v -password").exec();

  if (!user) throw createError("User not found.", 404);

  return convertUserStatusToGraphQL(user.toJSON());
};

/**
 * Finds a user by their email address.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object|null>} The user object or null if not found.
 */
export const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  return user ? convertUserStatusToGraphQL(user.toJSON()) : null;
};

/**
 * Creates a new user and returns an authentication token.
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
  try {
    const user = await UserModel.create({ username, email, password });
    const token = signToken(user.username, user.email, user._id, user.isAdmin);
    return { token, user: convertUserStatusToGraphQL(user.toJSON()) };
  } catch (error: any) {
    throw createError("Error creating user: " + error.message, 500);
  }
};

/**
 * Authenticates a user and returns a JWT.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ token: string; user: Object }>} JWT and user details.
 * @throws {Error} If authentication fails.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw createError("User not found.", 404);

  const isValid = await user.isCorrectPassword(password);
  if (!isValid) throw createError("Incorrect password.", 401);

  const token = signToken(user.username, user.email, user._id, user.isAdmin);
  return { token, user: convertUserStatusToGraphQL(user.toJSON()) };
};

/**
 * Saves a book to the user's library.
 * @param {string} userId - User's ID.
 * @param {Object} bookData - Book details.
 * @param {BookStatus} status - Reading status.
 * @returns {Promise<Object>} Updated user with GraphQL-compatible status.
 */
export const saveBookToLibrary = async (
  userId: string,
  bookData: any,
  status: BookStatus
) => {
  const mappedStatus = mapGraphQLStatusToMongoose(status);

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: userId, "savedBooks.bookDetails.bookId": { $ne: bookData.bookId } },
    {
      $addToSet: {
        savedBooks: { bookDetails: bookData, status: mappedStatus },
      },
    },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw createError(
      "Book already exists in the user's library or user not found.",
      400
    );
  }

  return convertUserStatusToGraphQL(updatedUser.toJSON());
};

/**
 * Updates the reading status of a saved book.
 * @param {string} userId - User's ID.
 * @param {string} bookId - Book's ID.
 * @param {BookStatus} newStatus - New reading status.
 * @returns {Promise<Object>} Updated user with GraphQL-compatible status.
 */
export const updateBookStatusInLibrary = async (
  userId: string,
  bookId: string,
  newStatus: BookStatus
) => {
  const mappedStatus = mapGraphQLStatusToMongoose(newStatus);

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: userId, "savedBooks.bookDetails.bookId": bookId },
    { $set: { "savedBooks.$.status": mappedStatus } },
    { new: true }
  );

  if (!updatedUser) {
    throw createError(
      "Book not found in user's library or user not found.",
      404
    );
  }

  return convertUserStatusToGraphQL(updatedUser.toJSON());
};

/**
 * Removes a book from the user's library.
 * @param {string} userId - User's ID.
 * @param {string} bookId - Book's ID to remove.
 * @returns {Promise<Object>} Updated user without the removed book.
 */
export const removeBookFromLibrary = async (userId: string, bookId: string) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { savedBooks: { "bookDetails.bookId": bookId } } },
    { new: true }
  );

  if (!updatedUser) {
    throw createError("User not found or book not in library.", 404);
  }

  return convertUserStatusToGraphQL(updatedUser.toJSON());
};

/**
 * Removes a user and related books by User ID.
 * @param {string} userId - User's ID.
 * @throws {Error} If user is not found.
 */
export const removeUser = async (userId: string) => {
  const user = await UserModel.findByIdAndDelete({ _id: userId });

  if (!user) {
    throw createError("User not found.", 404);
  }
};
