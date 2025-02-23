import { getGoogleBookById } from "../services/bookService.js";
import fetch from "node-fetch";

/**
 * Searches books using the Google Books API.
 * @param {string} query - Search term for books.
 * @returns {Promise<Array>} - List of books with detailed information.
 * @throws {Error} If the fetch from Google Books API fails.
 */
export const searchBooks = async (query: string) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok)
      throw new Error("Failed to fetch data from Google Books API");

    const data = await response.json();
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
  } catch (error) {
    console.error("Error fetching books:", error);
    throw new Error("Failed to fetch books from Google Books API");
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
    return await getGoogleBookById(volumeId);
  } catch (error) {
    console.error(`Error fetching book with ID ${volumeId}:`, error);
    throw new Error("Failed to fetch book details from Google Books API");
  }
};