import { getGoogleBookById } from "../services/bookService.js";
import fetch from "node-fetch";
import { createError } from "../middleware/errorHandler.js";

/**
 * Searches books using the Google Books API.
 * @param {string} query - Search term for books.
 * @returns {Promise<Array>} - List of books with detailed information.
 * @throws {Error} If the fetch from Google Books API fails.
 */
export const searchBooks = async (query: string) => {
  try {
    if (!query) {
      throw createError("Search query is required", 400);
    }

    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw createError(
        "Failed to fetch data from Google Books API",
        response.status
      );
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      throw createError("No books found for the given query", 404);
    }

    return data.items.map((item: any) => ({
      bookId: item.id,
      title: item.volumeInfo.title || "No title available",
      authors: item.volumeInfo.authors || [],
      description: item.volumeInfo.description || "No description available",
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || "",
      pageCount: item.volumeInfo.pageCount || 0,
      categories: item.volumeInfo.categories || [],
      averageRating: item.volumeInfo.averageRating || 0,
      ratingsCount: item.volumeInfo.ratingsCount || 0,
      infoLink: item.volumeInfo.infoLink || "",
    }));
  } catch (error: any) {
    console.error("Error fetching books:", error.message);
    throw createError(
      error.message || "Failed to fetch books",
      error.statusCode || 500
    );
  }
};

/**
 * Retrieves detailed information about a book by volume ID.
 * @param {string} volumeId - Google Books API volume ID.
 * @returns {Promise<Object>} - Detailed book information or error if not found.
 * @throws {Error} If the fetch from Google Books API fails.
 */
export const fetchBookById = async (volumeId: string) => {
  try {
    if (!volumeId) {
      throw createError("Volume ID is required", 400);
    }

    const book = await getGoogleBookById(volumeId);

    if (!book) {
      throw createError(`No book found with ID: ${volumeId}`, 404);
    }

    return book;
  } catch (error: any) {
    console.error(`Error fetching book with ID ${volumeId}:`, error.message);
    throw createError(
      error.message || "Failed to fetch book details",
      error.statusCode || 500
    );
  }
};
