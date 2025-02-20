import { signToken } from "../utils/auth.js";
import { AuthenticationError } from "apollo-server-express";
import { User as UserModel } from "../models/index.js";
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
     * @param {any} _parent - Unused parent resolver argument.
     * @param {any} _args - Unused args resolver argument.
     * @param {Context} context - Context object containing user info.
     * @returns {Promise<User>} User data excluding sensitive fields.
     * @throws {AuthenticationError} If the user is not authenticated.
     */
    me: async (_parent: any, _args: any, context: Context) => {
      if (context.user) {
        return await UserModel.findById(context.user._id).select("-__v -password");
      }
      throw new AuthenticationError("Not logged in");
    },

    /**
     * Searches books using the Google Books API.
     * @function searchGoogleBooks
     * @param {any} _parent - Unused parent resolver argument.
     * @param {SearchGoogleBooksArgs} args - Search query string.
     * @returns {Promise<Array>} Array of books matching the search query with required fields.
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
  },

  Mutation: {
    /**
     * Creates a new user and signs a JWT token.
     * @function addUser
     * @param {any} _parent - Unused parent resolver argument.
     * @param {Object} args - User credentials.
     * @returns {Promise<{ token: string; user: User }>} The user object with a signed JWT.
     */
    addUser: async (_parent: any, { username, email, password }: any) => {
      const user = await UserModel.create({ username, email, password });
      const token = signToken(user.email, user._id);
      return { token, user };
    },

    /**
     * Authenticates a user and returns a signed JWT token.
     * @function login
     * @param {any} _parent - Unused parent resolver argument.
     * @param {Object} args - User credentials (email, password).
     * @returns {Promise<{ token: string; user: User }>} The authenticated user and token.
     * @throws {AuthenticationError} If user credentials are invalid.
     */
    login: async (_parent: any, { email, password }: any) => {
      const user = await UserModel.findOne({ email });
      if (!user) throw new AuthenticationError("Can't find this user");

      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) throw new AuthenticationError("Wrong password!");

      const token = signToken(user.email, user._id);
      return { token, user };
    },

    /**
     * Placeholder: Future implementation for saving books to user's library.
     * @function saveBook
     * @returns {Promise<void>} Placeholder for future book-saving logic.
     */
    // saveBook: async (_parent: any, _args: any, _context: Context) => {},
      // Future implementation placeholder

    /**
     * Placeholder: Future implementation for removing a book from user's library.
     * @function removeBook
     * @returns {Promise<void>} Placeholder for future book-removal logic.
     */
    // removeBook: async (_parent: any, _args: any, _context: Context) => {},
      // Future implementation placeholder
  },
};

export default resolvers;