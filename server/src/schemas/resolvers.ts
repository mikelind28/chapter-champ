import { User as UserModel } from "../models/index.js";
import { signToken, AuthenticationError } from "../utils/auth.js";
import {
  searchGoogleBooks,
  getGoogleBookById,
} from "../services/bookService.js";

interface User {
  _id: string;
  email: string;
  password: string;
}

interface AddUserArgs {
  input: {
    email: string;
    password: string;
  };
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    /**
     * Retrieves the currently authenticated user's information.
     * @param _parent - Unused parent resolver argument.
     * @param _args - Unused args resolver argument.
     * @param context - Context object containing user info.
     * @returns User data with savedBooks populated.
     */
    me: async (_parent: any, _args: any, context: Context) => {
      if (context.user) {
        console.log("Found userId:", context.user._id);
        return await UserModel.findById(context.user._id).populate(
          "savedBooks"
        );
      }
      throw new AuthenticationError("Could not authenticate user.");
    },

    /**
     * Searches books using the Google Books API.
     * @param _parent - Unused parent resolver argument.
     * @param args - Query argument containing the search string.
     * @returns Array of books matching the search query.
     */
    searchGoogleBooks: async (_parent: any, { query }: { query: string }) => {
      return await searchGoogleBooks(query);
    },

    /**
     * Retrieves detailed book information by volume ID.
     * @param _parent - Unused parent resolver argument.
     * @param args - Argument containing the volume ID.
     * @returns Detailed book information.
     */
    getGoogleBookById: async (
      _parent: any,
      { volumeId }: { volumeId: string }
    ) => {
      return await getGoogleBookById(volumeId);
    },
  },

  Mutation: {
    /**
     * Adds a new user and returns an authentication token.
     * @param _parent - Unused parent resolver argument.
     * @param input - Object containing email and password.
     * @returns The user object along with a signed JWT.
     */
    addUser: async (
      _parent: any,
      { input }: AddUserArgs
    ): Promise<{ token: string; user: User }> => {
      if (!input.email || !input.password) {
        throw new Error("Both email and password are required.");
      }
      const user = await UserModel.create({ ...input });
      const token = signToken(user.email, user._id);
      return { token, user };
    },

    /**
     * Logs a user in and returns a signed authentication token.
     * @param _parent - Unused parent resolver argument.
     * @param email - User email.
     * @param password - User password.
     * @returns The user object and authentication token.
     */
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Could not find user with this email.");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Password authentication failed.");
      }
      const token = signToken(user.email, user._id);
      return { token, user };
    },
  },
};

export default resolvers;
