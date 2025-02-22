import { AuthenticationError } from "apollo-server-express";
import { getGoogleBookById } from "../services/bookService.js";
import {
  getUserById,
  createUser,
  loginUser,
  saveBookToLibrary,
  updateBookStatusInLibrary,
  removeBookFromLibrary,
} from "../services/userService.js";
import fetch from "node-fetch";

interface SearchGoogleBooksArgs {
  query: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
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
     * @throws {AuthenticationError} If the user is not authenticated.
     */
    me: async (_parent: any, _args: any, context: Context) => {
      if (context.user) {
        return await getUserById(context.user._id);
      }
      throw new AuthenticationError("Not logged in");
    },

    /**
     * Searches books using the Google Books API.
     * @function searchGoogleBooks
     * @returns {Promise<Array>} Array of books matching the search query.
     */
    searchGoogleBooks: async (_parent: any, { query }: SearchGoogleBooksArgs) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) throw new Error("Failed to fetch from Google Books API");

        const data = await response.json();
        return data.items.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title || "No title available",
          authors: item.volumeInfo.authors || [],
          description: item.volumeInfo.description || "No description available",
          thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
          pageCount: item.volumeInfo.pageCount || 0,
          categories: item.volumeInfo.categories || [],
          averageRating: item.volumeInfo.averageRating || 0,
          ratingsCount: item.volumeInfo.ratingsCount || 0,
          infoLink: item.volumeInfo.infoLink || "",
        }));
      } catch (err) {
        console.error("Error fetching books:", err);
        throw new Error("Failed to fetch books from Google Books API");
      }
    },

    /**
     * Retrieves detailed book information by volume ID.
     * @function getGoogleBookById
     * @returns {Promise<Object>} Detailed book information.
     */
    getGoogleBookById: async (_parent: any, { volumeId }: { volumeId: string }) => {
      try {
        return await getGoogleBookById(volumeId);
      } catch (err) {
        console.error("Error fetching book by ID:", err);
        throw new Error("Failed to fetch book details from Google Books API");
      }
    },
  },

  Mutation: {
    /**
     * Creates a new user and signs a JWT token.
     * @function addUser
     * @returns {Promise<{ token: string; user: User }>} The user object with a signed JWT.
     */
    addUser: async (_parent: any, { username, email, password }: any) => {
      return await createUser(username, email, password);
    },

    /**
     * Authenticates a user and returns a signed JWT token.
     * @function login
     * @returns {Promise<{ token: string; user: User }>} The authenticated user and token.
     * @throws {AuthenticationError} If user credentials are invalid.
     */
    login: async (_parent: any, { email, password }: any) => {
      return await loginUser(email, password);
    },

/**
     * Saves a book to the user's library with the specified reading status.
     * @function saveBook
     * @param {BookInput} input - The book details input.
     * @param {string} status - The reading status ("Want to Read", "Currently Reading", etc.).
     * @returns {Promise<User>} The updated user object with the new book saved.
     * @throws {AuthenticationError} If the user is not authenticated.
     */
saveBook: async (_parent: any, { input, status }: any, context: Context) => {
  if (!context.user) throw new AuthenticationError("You must be logged in to save a book.");
  return await saveBookToLibrary(context.user._id, input, status);
},

/**
 * Updates the reading status of a saved book in the user's library.
 * @function updateBookStatus
 * @param {string} bookId - The ID of the book to update.
 * @param {string} status - The new reading status.
 * @returns {Promise<User>} The updated user object after status change.
 * @throws {AuthenticationError} If the user is not authenticated.
 */
updateBookStatus: async (_parent: any, { bookId, status }: any, context: Context) => {
  if (!context.user) throw new AuthenticationError("You must be logged in to update book status.");
  return await updateBookStatusInLibrary(context.user._id, bookId, status);
},

/**
 * Removes a book from the user's library by its ID.
 * @function removeBook
 * @param {string} bookId - The ID of the book to remove.
 * @returns {Promise<User>} The updated user object after the book removal.
 * @throws {AuthenticationError} If the user is not authenticated.
 */
removeBook: async (_parent: any, { bookId }: any, context: Context) => {
  if (!context.user) throw new AuthenticationError("You must be logged in to remove a book.");
  return await removeBookFromLibrary(context.user._id, bookId);
},
  },
};

export default resolvers;