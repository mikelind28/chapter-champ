import {
  getCurrentUser,
  getUsers,
  registerUser,
  authenticateUser,
  saveBook,
  updateBookStatus,
  removeBook,
  getAllUsers,
  promoteUserToAdmin,
  updateUserDetails,
  deleteUser,
} from "../controllers/userController.js";
import { searchBooks, fetchBookById } from "../controllers/bookController.js";
import { createError } from "../middleware/errorHandler.js";

interface SearchGoogleBooksArgs {
  query: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    /**
     * Retrieves the currently authenticated user's data.
     * @function me
     * @returns {Promise<User>} User data excluding sensitive fields.
     */
    me: async (_parent: any, _args: any, context: Context) => {
      try {
        return await getCurrentUser(context);
      } catch (error: any) {
        throw createError(`Failed to retrieve user: ${error.message}`, 500);
      }
    },

    /**
     * Retrieves all users in the system (Admin-only). F
     * @function getUsers
     * @returns {Promise<Array>} Array of user data.
     */
    getUsers: async (_parent: any, _args: any, context: Context) => {
      try {
        return await getUsers(context);
      } catch (error: any) {
        throw createError(`Error fetching users: ${error.message}`, 500);
      }
    },

    /**
     * Admin-only: Retrieves all users in the system. Future use.
     * @function getAllUsers
     * @returns {Promise<Array>} Array of user data.
     */
    getAllUsers: async (_parent: any, _args: any, context: Context) => {
      try {
        return await getAllUsers(context);
      } catch (error: any) {
        throw createError(`Error retrieving all users: ${error.message}`, 500);
      }
    },

    /**
     * Searches books using the Google Books API.
     * @function searchGoogleBooks
     * @returns {Promise<Array>} Array of books matching the search query.
     */
    searchGoogleBooks: async (
      _parent: any,
      { query }: SearchGoogleBooksArgs
    ) => {
      try {
        return await searchBooks(query);
      } catch (error: any) {
        throw createError(`Book search failed: ${error.message}`, 500);
      }
    },

    /**
     * Retrieves detailed book information by volume ID.
     * @function getGoogleBookById
     * @returns {Promise<Object>} Detailed book information.
     */
    getGoogleBookById: async (
      _parent: any,
      { volumeId }: { volumeId: string }
    ) => {
      try {
        return await fetchBookById(volumeId);
      } catch (error: any) {
        throw createError(`Error fetching book details: ${error.message}`, 500);
      }
    },
  },

  Mutation: {
    /**
     * Registers a new user and returns the authentication token.
     * @function addUser
     * @returns {Promise<{ token: string; user: User }>} The user object with a signed JWT.
     */
    addUser: async (_parent: any, { username, email, password }: any) => {
      try {
        return await registerUser(username, email, password);
      } catch (error: any) {
        throw createError(`User registration failed: ${error.message}`, 400);
      }
    },

    /**
     * Authenticates a user and returns a signed JWT token.
     * @function login
     * @returns {Promise<{ token: string; user: User }>} The authenticated user and token.
     */
    login: async (_parent: any, { email, password }: any) => {
      try {
        return await authenticateUser(email, password);
      } catch (error: any) {
        throw createError(`Authentication failed: ${error.message}`, 401);
      }
    },

    /**
     * Updates the current user's username and email.
     * @function updateUser
     * @returns {Promise<User>} The updated user object.
     */
    updateUser: async (
      _parent: any,
      { username, email }: any,
      context: Context
    ) => {
      try {
        if (!context.user) throw createError("Authentication required.", 401);
        return await updateUserDetails(context, username, email);
      } catch (error: any) {
        throw createError(`Error updating user: ${error.message}`, 400);
      }
    },

    /**
     * Deletes a user and their related books (Admin-only).
     * @function removeUser
     * @returns {Promise<User>} The deleted user.
     */
    removeUser: async (_parent: any, { userId }: any, context: Context) => {
      try {
        return await deleteUser(context, userId);
      } catch (error: any) {
        throw createError(`Error removing user: ${error.message}`, 500);
      }
    },

    /**
     * Saves a book to the user's library with a specified reading status.
     * @function saveBook
     * @returns {Promise<User>} The updated user object.
     */
    saveBook: async (_parent: any, { input }: any, context: Context) => {
      try {
        const { status, ...bookDetails } = input;
        return await saveBook(context, bookDetails, status);
      } catch (error: any) {
        throw createError(`Error saving book: ${error.message}`, 500);
      }
    },

    /**
     * Updates the reading status of a saved book.
     * @function updateBookStatus
     * @returns {Promise<User>} The updated user object.
     */
    updateBookStatus: async (
      _parent: any,
      { bookId, status }: any,
      context: Context
    ) => {
      try {
        return await updateBookStatus(context, bookId, status);
      } catch (error: any) {
        throw createError(`Error updating book status: ${error.message}`, 500);
      }
    },

    /**
     * Removes a book from the user's library.
     * @function removeBook
     * @returns {Promise<User>} The updated user object after the book removal.
     */
    removeBook: async (_parent: any, { bookId }: any, context: Context) => {
      try {
        return await removeBook(context, bookId);
      } catch (error: any) {
        throw createError(`Error removing book: ${error.message}`, 500);
      }
    },

    /**
     * Admin-only: Promotes a user to admin status. Future use.
     * @function promoteUser
     * @returns {Promise<User>} Updated user with admin privileges.
     */
    promoteUser: async (_parent: any, { userId }: any, context: Context) => {
      try {
        return await promoteUserToAdmin(context, userId);
      } catch (error: any) {
        throw createError(`Error promoting user: ${error.message}`, 500);
      }
    },
  },
};

export default resolvers;
