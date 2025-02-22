import { AuthenticationError } from "apollo-server-express";
import { getGoogleBookById } from "../services/bookService.js";
import {
  getUserById,
  createUser,
  loginUser,
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
     * Placeholder: Future implementation for saving books to user's library.
     * @function saveBook
     */
    // saveBook: async (_parent: any, _args: any, _context: Context) => {},

    /**
     * Placeholder: Future implementation for removing a book from user's library.
     * @function removeBook
     */
    // removeBook: async (_parent: any, _args: any, _context: Context) => {},
  },
};

export default resolvers;