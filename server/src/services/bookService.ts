import axios from "axios";
import { createError } from "../middleware/errorHandler.js";

const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Search for books using the Google Books API.
 * @param query - Search term (title, author, etc.).
 * @param maxResults - Number of books to return.
 * @returns A list of books matching the query.
 * @throws {Error} If the request to the Google Books API fails.
 */
export const searchGoogleBooks = async (
  query: string,
  maxResults: number = 10
) => {
  try {
    const response = await axios.get(GOOGLE_BOOKS_BASE_URL, {
      params: {
        q: query,
        maxResults,
        key: process.env.GOOGLE_BOOKS_API_KEY,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      throw createError("No books found for the given query.", 404);
    }

    return response.data.items.map((book: any) => ({
      bookId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      description: book.volumeInfo.description || "No description available.",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
      pageCount: book.volumeInfo.pageCount || 0,
      categories: book.volumeInfo.categories || [],
      averageRating: book.volumeInfo.averageRating || 0,
      ratingsCount: book.volumeInfo.ratingsCount || 0,
      infoLink: book.volumeInfo.infoLink || "",
    }));
  } catch (error: any) {
    console.error(`Google Books API error: ${error.message || error}`);

    if (error.response) {
      // Handle specific HTTP errors
      throw createError(
        `Google Books API error: ${error.response.statusText}`,
        error.response.status
      );
    }

    throw createError("Failed to fetch books from Google Books API.", 500);
  }
};

/**
 * Fetch detailed information about a specific book by volume ID.
 * @param volumeId - The Google Books volume ID.
 * @returns Book details.
 * @throws {Error} If the request to the Google Books API fails.
 */
export const getGoogleBookById = async (volumeId: string) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/${volumeId}`, {
      params: { key: process.env.GOOGLE_BOOKS_API_KEY },
    });

    if (!response.data || !response.data.volumeInfo) {
      throw createError("Book details not found.", 404);
    }

    const book = response.data;
    return {
      bookId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      description: book.volumeInfo.description || "No description available.",
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
      pageCount: book.volumeInfo.pageCount || 0,
      categories: book.volumeInfo.categories || [],
      averageRating: book.volumeInfo.averageRating || 0,
      ratingsCount: book.volumeInfo.ratingsCount || 0,
      infoLink: book.volumeInfo.infoLink || "",
    };
  } catch (error: any) {
    console.error(`Google Books API error: ${error.message || error}`);

    if (error.response) {
      throw createError(
        `Google Books API error: ${error.response.statusText}`,
        error.response.status
      );
    }

    throw createError(
      "Failed to fetch book details from Google Books API.",
      500
    );
  }
};
