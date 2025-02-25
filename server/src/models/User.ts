import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";
import bookSchema, { BookDocument } from "./Book.js";
import type { BookStatus } from "../types/readingStatus.js";

/**
 * Interface for a saved book entry, including book details and reading status.
 */
interface SavedBook {
  bookDetails: BookDocument;
  status: BookStatus;
}

/**
 * UserDocument interface representing the structure of a User document in MongoDB.
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
 * userSchema - Mongoose schema definition for the User model.
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
      required: [true, "Email address is required."],
      unique: true,
      lowercase: true,
      match: [/.+@.+\..+/, "Must provide a valid email address."],
    },
    password: { type: String, required: [true, "Password is required."] },
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
      virtuals: true, // Ensures virtual properties are included in responses
    },
  }
);

/**
 * Middleware: Hashes the user's password before saving, if modified or new.
 */
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

/**
 * Checks if the provided password matches the hashed password in the database.
 * @param password - The plain-text password to validate.
 * @returns {Promise<boolean>} - True if passwords match, else false.
 */
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Virtual property for book counts based on status
userSchema.virtual("favoriteCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) =>
      book.status === "FAVORITE" || book.status === "Favorite"
  ).length;
});

userSchema.virtual("wantToReadCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) =>
      book.status === "WANT_TO_READ" || book.status === "Want to Read"
  ).length;
});

userSchema.virtual("currentlyReadingCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) =>
      book.status === "CURRENTLY_READING" || book.status === "Currently Reading"
  ).length;
});

userSchema.virtual("finishedReadingCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) =>
      book.status === "FINISHED_READING" || book.status === "Finished Reading"
  ).length;
});

const User = model<UserDocument>("User", userSchema);
export default User;
