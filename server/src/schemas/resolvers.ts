import {
  getCurrentUser,
  registerUser,
  authenticateUser,
  saveBook,
  updateBookStatus,
  removeBook,
  getAllUsers,
  promoteUserToAdmin,
} from "../controllers/userController.js";
import { searchBooks, fetchBookById } from "../controllers/bookController.js";

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
      return await getCurrentUser(context);
    },

    /**
     * Admin-only: Retrieves all users in the system.
     * @function getAllUsers
     * @returns {Promise<Array>} Array of user data.
     */
    getAllUsers: async (_parent: any, _args: any, context: Context) => {
      return await getAllUsers(context);
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
      return await searchBooks(query);
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
      return await fetchBookById(volumeId);
    },
  },

  Mutation: {
    /**
     * Registers a new user and returns the authentication token.
     * @function addUser
     * @returns {Promise<{ token: string; user: User }>} The user object with a signed JWT.
     */
    addUser: async (_parent: any, { username, email, password }: any) => {
      return await registerUser(username, email, password);
    },

    /**
     * Authenticates a user and returns a signed JWT token.
     * @function login
     * @returns {Promise<{ token: string; user: User }>} The authenticated user and token.
     * @throws {AuthenticationError} If user credentials are invalid.
     */
    login: async (_parent: any, { email, password }: any) => {
      return await authenticateUser(email, password);
    },

    /**
     * Saves a book to the user's library with a specified reading status.
     * @function saveBook
     * @param {BookInput} input - The book details input.
     * @param {string} status - The reading status (GraphQL Enum).
     * @returns {Promise<User>} The updated user object.
     */
    saveBook: async (_parent: any, { input }: any, context: Context) => {
      const { status, ...bookDetails } = input;
      return await saveBook(context, bookDetails, status);
    },

    /**
     * Updates the reading status of a saved book in the user's library.
     * @function updateBookStatus
     * @param {string} bookId - The ID of the book to update.
     * @param {string} status - The new reading status (GraphQL Enum).
     * @returns {Promise<User>} The updated user object.
     */
    updateBookStatus: async (
      _parent: any,
      { bookId, status }: any,
      context: Context
    ) => {
      return await updateBookStatus(context, bookId, status);
    },

    /**
     * Removes a book from the user's library by its ID.
     * @function removeBook
     * @param {string} bookId - The ID of the book to remove.
     * @returns {Promise<User>} The updated user object after the book removal.
     */
    removeBook: async (_parent: any, { bookId }: any, context: Context) => {
      return await removeBook(context, bookId);
    },

    /**
     * Admin-only: Promotes a user to admin status.
     * @function promoteUser
     * @param {string} userId - The ID of the user to promote.
     * @returns {Promise<User>} Updated user with admin privileges.
     */
    promoteUser: async (_parent: any, { userId }: any, context: Context) => {
      return await promoteUserToAdmin(context, userId);
    },
  },
};

export default resolvers;
