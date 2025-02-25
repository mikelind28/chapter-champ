import { Schema, type Document } from "mongoose";

/**
 * BookDocument interface representing the structure of a book.
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
 * bookSchema - Defines the Mongoose schema for a Book subdocument.
 */
const bookSchema = new Schema<BookDocument>(
  {
    bookId: {
      type: String,
      required: [true, "Book ID is required."],
    },
    title: {
      type: String,
      required: [true, "Book title is required."],
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
      validate: {
        validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
        message: "Thumbnail must be a valid URL.",
      },
    },
    pageCount: {
      type: Number,
      default: 0,
      min: [0, "Page count cannot be negative."],
    },
    categories: {
      type: [String],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Average rating cannot be negative."],
      max: [5, "Average rating cannot exceed 5."],
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: [0, "Ratings count cannot be negative."],
    },
    infoLink: {
      type: String,
      default: "",
      validate: {
        validator: (v: string) => !v || /^https?:\/\/.+/.test(v),
        message: "Info link must be a valid URL.",
      },
    },
  },
  {
    _id: false,
  }
);

// Export the schema
export { bookSchema };
export default bookSchema;
