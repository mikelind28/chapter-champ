import {
  getCurrentUser,
  registerUser,
  authenticateUser,
  saveBook,
  updateBookStatus,
  removeBook,
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
      try {
        return await getCurrentUser(context);
      } catch (error) {
        console.error("Error retrieving user:", error);
        throw new Error("Failed to retrieve user data.");
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
      } catch (error) {
        console.error("Error searching books:", error);
        throw new Error("Failed to search books.");
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
      } catch (error) {
        console.error("Error fetching book details:", error);
        throw new Error("Failed to retrieve book details.");
      }
    },
  },

  Mutation: {
    /**
     * Registers a new user and returns the authentication token.
     * @function addUser
     * @returns {Promise<{ token: string; user: User }>} The newly created user object along with a signed JWT token.
     */
    addUser: async (_parent: any, { username, email, password }: any) => {
      try {
        return await registerUser(username, email, password);
      } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user.");
      }
    },

    /**
     * Authenticates a user and returns a signed JWT token upon successful login.
     * @function login
     * @returns {Promise<{ token: string; user: User }>} The authenticated user object and JWT token.
     */
    login: async (_parent: any, { email, password }: any) => {
      try {
        return await authenticateUser(email, password);
      } catch (error) {
        console.error("Error during login:", error);
        throw new Error("Login failed. Check credentials and try again.");
      }
    },

    /**
     * Saves a book to the user's library with a specified reading status.
     * @function saveBook
     * @returns {Promise<User>} The updated user object after the book is saved.
     */
    saveBook: async (_parent: any, { input }: any, context: Context) => {
      try {
        const { status, ...bookDetails } = input;
        return await saveBook(context, bookDetails, status);
      } catch (error) {
        console.error("Error saving book:", error);
        throw new Error("Failed to save book.");
      }
    },

    /**
     * Updates the reading status of a saved book in the user's library.
     * @function updateBookStatus
     * @returns {Promise<User>} The updated user object with the modified reading status.
     */
    updateBookStatus: async (
      _parent: any,
      { bookId, status }: any,
      context: Context
    ) => {
      try {
        return await updateBookStatus(context, bookId, status);
      } catch (error) {
        console.error("Error updating book status:", error);
        throw new Error("Failed to update book status.");
      }
    },

    /**
     * Removes a book from the user's library by its ID.
     * @function removeBook
     * @returns {Promise<User>} The updated user object after the specified book has been removed.
     */
    removeBook: async (_parent: any, { bookId }: any, context: Context) => {
      try {
        return await removeBook(context, bookId);
      } catch (error) {
        console.error("Error removing book:", error);
        throw new Error("Failed to remove book.");
      }
    },
  },
};

export default resolvers;
