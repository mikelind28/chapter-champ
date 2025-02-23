import { Schema, model, type Document } from "mongoose";
import bcrypt from "bcrypt";
import bookSchema, { BookDocument } from "./Book.js";
import type { BookStatus } from "../types/readingStatus.js";
import { __EnumValue } from "graphql";

// Interface definition for savedBooks with status
interface SavedBook {
  bookDetails: BookDocument;
  status: BookStatus;
}

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

// User schema with savedBooks including status field
const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: { type: String, required: true },
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

// Hash user password before saving
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Validate user password during login
// Validate user password during login
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Virtual property for book counts based on status
userSchema.virtual("favoriteCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) => book.status === "FAVORITE" || book.status === "Favorite"
  ).length;
});

userSchema.virtual("wantToReadCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) => book.status === "WANT_TO_READ" || book.status === "Want to Read"
  ).length;
});

userSchema.virtual("currentlyReadingCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) => book.status === "CURRENTLY_READING" || book.status === "Currently Reading"
  ).length;
});

userSchema.virtual("finishedReadingCount").get(function () {
  return this.savedBooks.filter(
    (book: SavedBook) => book.status === "FINISHED_READING" || book.status === "Finished Reading"
  ).length;
});

const User = model<UserDocument>("User", userSchema);
export default User;
