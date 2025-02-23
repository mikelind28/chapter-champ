import { Schema, type Document } from "mongoose";

/**
 * BookDocument interface representing a book's structure.
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
 * bookSchema - defines the structure for the Book subdocument.
 */
const bookSchema = new Schema<BookDocument>(
  {
    bookId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: "No description available.",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    categories: {
      type: [String],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    infoLink: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

export { bookSchema };
export default bookSchema;