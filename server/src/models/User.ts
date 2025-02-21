import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Placeholder: In the future, import the Book schema and related types when the library feature is implemented
// Example: import bookSchema from './Book.js';
// Example: import type { BookDocument } from './Book.js';

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  isCorrectPassword(password: string): Promise<boolean>;
  // Placeholder: savedBooks field will reference the user's library.
  // Each book will have a status: "Want to Read", "Currently Reading", or "Finished".
  /// Example (future): savedBooks: [{ book details, status }];

  // Placeholder: A future virtual property to count books based on their status.
  // Example: totalBooks, currentlyReadingCount, finishedBooksCount, etc.
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Trim username for consistency
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Placeholder: savedBooks field will store the user's library with book status information.
  },
  {
    toJSON: {
      virtuals: true, // Virtuals will support future computed fields like book counts.
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Method to compare and validate password for authentication
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Placeholder: Future virtual properties for book counts and bingo game progress will be added here.

const User = model<UserDocument>('User', userSchema);

export default User;
