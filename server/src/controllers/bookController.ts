import {
  getGoogleBookById,
  searchGoogleBooks,
} from "../services/bookService.js";

/**
 * Searches books using the Google Books API.
 * @param {string} query - Search term for books.
 * @returns {Promise<Array>} - List of books with detailed information.
 * @throws {Error} If the fetch from Google Books API fails.
 */
export const searchBooks = async (query: string) => {
  if (!query) {
    console.warn("searchBooks called without a query.");
    throw new Error("Query parameter is required.");
  }

  try {
    console.log(`Searching books for query: "${query}"`);
    const books = await searchGoogleBooks(query);
    console.log(`Found ${books.length} books for query: "${query}"`);
    return books;
  } catch (error) {
    console.error(`Error fetching books for query "${query}":`, error);
    throw new Error(`Failed to fetch books for query: "${query}"`);
  }
};

/**
 * Retrieves detailed information about a book by volume ID.
 * @param {string} volumeId - Google Books API volume ID.
 * @returns {Promise<Object>} - Detailed book information or error if not found.
 * @throws {Error} If the fetch from Google Books API fails.
 */
export const fetchBookById = async (volumeId: string) => {
  if (!volumeId) {
    console.warn("fetchBookById called without a volumeId.");
    throw new Error("Volume ID is required.");
  }

  try {
    console.log(`Fetching details for book with ID: ${volumeId}`);
    const bookDetails = await getGoogleBookById(volumeId);
    console.log(`Successfully retrieved details for book ID: ${volumeId}`);
    return bookDetails;
  } catch (error) {
    console.error(`Error fetching book with ID "${volumeId}":`, error);
    throw new Error(`Failed to fetch book details for ID: "${volumeId}"`);
  }
};
