import { Schema, type Document } from "mongoose";

/**
 * @interface BookDocument
 * Represents a book stored in a user's library.
 * This schema is used as a subdocument within the User model.
 */
export interface BookDocument extends Document {
  bookId: string;
  title: string;
  authors?: string[];
  description?: string;
  thumbnail?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  infoLink?: string;
}

/**
 * @constant bookSchema
 * Defines the structure for the Book subdocument in the User model.
 */
const bookSchema = new Schema<BookDocument>(
  {
    bookId: {
      type: String,
      required: [true, "Book ID is required."], // Ensures book has a valid ID
    },
    title: {
      type: String,
      required: [true, "Title is required."], // Ensures book has a valid title
    },
    authors: {
      type: [String],
      default: [], // Defaults to an empty array if no authors are provided
    },
    description: {
      type: String,
      default: "No description available.", // Fallback for missing descriptions
    },
    thumbnail: {
      type: String,
      default: "", // Empty string if no thumbnail is available
    },
    pageCount: {
      type: Number,
      default: 0, // Default to 0 if page count is unknown
    },
    categories: {
      type: [String],
      default: [], // Defaults to an empty array if no categories are provided
    },
    averageRating: {
      type: Number,
      default: 0, // Default rating is 0 if none exists
    },
    ratingsCount: {
      type: Number,
      default: 0, // Default to 0 if no ratings exist
    },
    infoLink: {
      type: String,
      default: "", // Empty string if no external link is available
    },
  },
  {
    _id: false, // Prevents a unique _id for each book entry in a user's collection
  }
);

export { bookSchema };
export default bookSchema;