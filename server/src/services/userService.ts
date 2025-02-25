import { User as UserModel } from "../models/index.js";
import { UserDocument } from "../models/User.js";
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
 * @param {UserDocument} user - The user object from the database.
 * @returns {any} The user object with GraphQL-compatible status values.
 */
const convertUserStatusToGraphQL = (user: UserDocument): any => {
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
 * @returns {Promise<any>} The user object with GraphQL-compatible status.
 */
export const getUserById = async (userId: string): Promise<any> => {
  const user = await UserModel.findById(userId).select("-__v -password").exec();

  if (!user) throw new Error("User not found.");

  return convertUserStatusToGraphQL(user.toJSON());
};

/**
 * Finds a user by their email address.
 *
 * @function findUserByEmail
 * @param {string} email - The user's email address.
 * @returns {Promise<any | null>} The user object or null if not found.
 */
export const findUserByEmail = async (email: string): Promise<any | null> => {
  const user = await UserModel.findOne({ email });
  return user ? convertUserStatusToGraphQL(user.toJSON()) : null;
};

/**
 * Creates a new user and returns an authentication token with user details.
 *
 * @function createUser
 * @param {string} username - Desired username.
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<{ token: string; user: any }>} JWT and user details.
 */
export const createUser = async (
  username: string,
  email: string,
  password: string
): Promise<{ token: string; user: any }> => {
  const user = await UserModel.create({ username, email, password });
  const token = signToken(user.email, user._id, user.isAdmin);
  return { token, user: convertUserStatusToGraphQL(user.toJSON()) };
};

/**
 * Authenticates a user and returns a JWT on success.
 *
 * @function loginUser
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{ token: string; user: any }>} JWT and user details.
 * @throws {AuthenticationError} If authentication fails.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: any }> => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new AuthenticationError("Can't find this user");

  const isValid = await user.isCorrectPassword(password);
  if (!isValid) throw new AuthenticationError("Wrong password!");

  const token = signToken(user.email, user._id, user.isAdmin);
  return { token, user: convertUserStatusToGraphQL(user.toJSON()) };
};

/**
 * Saves a book to the user's library with the specified reading status.
 *
 * @function saveBookToLibrary
 * @param {string} userId - User's ID.
 * @param {any} bookData - Book details.
 * @param {BookStatus} status - Reading status (GraphQL enum).
 * @returns {Promise<any>} Updated user with GraphQL-compatible status.
 * @throws {Error} If the user is not found or duplicate book exists.
 */
export const saveBookToLibrary = async (
  userId: string,
  bookData: any,
  status: BookStatus
): Promise<any> => {
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
    throw new Error(
      "Book already exists in the user's library or user not found."
    );
  }

  return convertUserStatusToGraphQL(updatedUser.toJSON());
};

/**
 * Updates the reading status of a saved book.
 *
 * @function updateBookStatusInLibrary
 * @param {string} userId - User's ID.
 * @param {string} bookId - Book's ID.
 * @param {BookStatus} newStatus - New reading status (GraphQL enum).
 * @returns {Promise<any>} Updated user with GraphQL-compatible status.
 * @throws {Error} If user or book not found.
 */
export const updateBookStatusInLibrary = async (
  userId: string,
  bookId: string,
  newStatus: BookStatus
): Promise<any> => {
  const mappedStatus = mapGraphQLStatusToMongoose(newStatus);

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: userId, "savedBooks.bookDetails.bookId": bookId },
    { $set: { "savedBooks.$.status": mappedStatus } },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("Book not found in user's library or user not found.");
  }

  return convertUserStatusToGraphQL(updatedUser.toJSON());
};

/**
 * Removes a book from the user's library by its ID.
 *
 * @function removeBookFromLibrary
 * @param {string} userId - User's ID.
 * @param {string} bookId - Book's ID to remove.
 * @returns {Promise<any>} Updated user without the removed book.
 * @throws {Error} If user not found.
 */
export const removeBookFromLibrary = async (
  userId: string,
  bookId: string
): Promise<any> => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $pull: { savedBooks: { "bookDetails.bookId": bookId } } },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found or book not in library.");
  }

  return convertUserStatusToGraphQL(updatedUser.toJSON());
};
