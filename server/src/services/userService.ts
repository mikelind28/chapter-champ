import { User as UserModel } from "../models/index.js";
import { signToken } from "../utils/auth.js";
import { AuthenticationError } from "apollo-server-express";

/**
 * Retrieves a user by ID excluding sensitive fields.
 * @param userId - The ID of the user.
 * @returns The user object without sensitive fields.
 */
export const getUserById = async (userId: string) => {
  return await UserModel.findById(userId).select("-__v -password");
};

/**
 * Finds a user by email.
 * @param email - User's email address.
 * @returns The user object or null if not found.
 */
export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

/**
 * Creates a new user and returns the user object with a signed JWT.
 * @param username - The user's username.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns An object containing the JWT and user details.
 */
export const createUser = async (username: string, email: string, password: string) => {
  const user = await UserModel.create({ username, email, password });
  const token = signToken(user.email, user._id);
  return { token, user };
};

/**
 * Logs in a user by validating credentials and returning a token.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns An object containing the JWT and user details.
 * @throws AuthenticationError if authentication fails.
 */
export const loginUser = async (email: string, password: string) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new AuthenticationError("Can't find this user");
    }
  
    // Using the model's isCorrectPassword method
    const isValid = await user.isCorrectPassword(password);
    if (!isValid) {
      throw new AuthenticationError("Wrong password!");
    }
  
    const token = signToken(user.email, user._id);
    return { token, user };
  };