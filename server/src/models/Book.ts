//imports
import { Schema, type Document } from "mongoose";

//interface
export interface BookDocument extends Document {
    bookId: string;
    title: string;
    authors?: string[];
    description?: string;
    thumbnail?: string;
    pageCount?: number;
    categories?: string;
    averageRating?: number;
    ratingsCount?: number;
    infoLink?: string;
}

//bookSchema - Part of User's array as subdocument
const bookSchema = new Schema<BookDocument>({
    bookId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    authors: [
        {
            type: String
        }
    ],
    description: {
        type: String
    },
    thumbnail: {
        type: String
    },
    pageCount: {
        type: Number,
    },
    categories: {
        type: String
    },
    averageRating: {
        type: Number
    },
    ratingsCount: {
        type: Number
    },
    infoLink: {
        type: String
    }
})

export default bookSchema;

//const Book = model<BookDocument>('Book', bookSchema);
//export default Book;