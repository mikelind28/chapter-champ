import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";
import bookSchema, { BookDocument } from "./Book.js";
import type { BookStatus } from "../types/readingStatus.js";

/**
 * @interface SavedBook
 * Represents a saved book in a user's library, including its reading status.
 */
interface SavedBook {
  bookDetails: BookDocument;
  status: BookStatus;
}

/**
 * @interface UserDocument
 * Defines the structure of a user document in the database.
 */
export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  savedBooks: SavedBook[];
  isCorrectPassword(password: string): Promise<boolean>;
  favoriteCount: number;
  wantToReadCount: number;
  currentlyReadingCount: number;
  finishedReadingCount: number;
  isAdmin: boolean;
}

/**
 * @constant userSchema
 * Defines the structure of the User collection in the database.
 */
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    savedBooks: [
      {
        bookDetails: { type: bookSchema, required: true },
        status: {
          type: String,
          enum: [
            "Want to Read",
            "Currently Reading",
            "Finished Reading",
            "Favorite",
          ],
          default: "Favorite",
        },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

/**
 * Middleware: Hashes user password before saving to the database.
 */
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

/**
 * @method isCorrectPassword
 * Validates the user's password during login.
 * @param {string} password - The input password.
 * @returns {Promise<boolean>} - True if the password is correct, otherwise false.
 */
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

/**
 * @virtual favoriteCount
 * Calculates the number of books marked as "Favorite".
 * @returns {number} - Count of favorite books.
 */
userSchema.virtual("favoriteCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) =>
      book.status === "FAVORITE" || book.status === "Favorite"
  ).length;
});

/**
 * @virtual wantToReadCount
 * Calculates the number of books marked as "Want to Read".
 * @returns {number} - Count of books in "Want to Read" status.
 */
userSchema.virtual("wantToReadCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) =>
      book.status === "WANT_TO_READ" || book.status === "Want to Read"
  ).length;
});

/**
 * @virtual currentlyReadingCount
 * Calculates the number of books marked as "Currently Reading".
 * @returns {number} - Count of books in "Currently Reading" status.
 */
userSchema.virtual("currentlyReadingCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) =>
      book.status === "CURRENTLY_READING" || book.status === "Currently Reading"
  ).length;
});

/**
 * @virtual finishedReadingCount
 * Calculates the number of books marked as "Finished Reading".
 * @returns {number} - Count of books in "Finished Reading" status.
 */
userSchema.virtual("finishedReadingCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) =>
      book.status === "FINISHED_READING" || book.status === "Finished Reading"
  ).length;
});

const User = model<UserDocument>("User", userSchema);
export default User;
