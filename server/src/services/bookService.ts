import axios from "axios";

const GOOGLE_BOOKS_BASE_URL = "https://www.googleapis.com/books/v1/volumes";

/**
 * Searches for books using the Google Books API.
 *
 * @async
 * @function searchGoogleBooks
 * @param {string} query - Search term (title, author, etc.).
 * @param {number} [maxResults=10] - Maximum number of books to return.
 * @returns {Promise<Array>} A list of books matching the query.
 * @throws Will throw an error if the API request fails or data is missing.
 */
export const searchGoogleBooks = async (
  query: string,
  maxResults: number = 10
) => {
  if (!process.env.GOOGLE_BOOKS_API_KEY) {
    console.error("Missing Google Books API Key");
    throw new Error("Google Books API Key is not configured.");
  }

  try {
    console.log(`Searching Google Books API for query: "${query}"`);
    const response = await axios.get(GOOGLE_BOOKS_BASE_URL, {
      params: {
        q: query,
        maxResults,
        key: process.env.GOOGLE_BOOKS_API_KEY,
      },
    });

    if (!response.data || !response.data.items) {
      console.warn("No books found for the given query.");
      return [];
    }

    console.log(`Found ${response.data.items.length} books.`);
    return response.data.items.map((book: any) => ({
      bookId: book.id,
      title: book.volumeInfo.title || "No title available.",
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
    console.error(`Google Books API error (Search): ${error.message}`);
    throw new Error("Failed to fetch books from Google Books API.");
  }
};

/**
 * Fetches detailed information about a specific book by its volume ID.
 *
 * @async
 * @function getGoogleBookById
 * @param {string} volumeId - The Google Books volume ID.
 * @returns {Promise<Object>} Detailed book information.
 * @throws Will throw an error if the API request fails or data is missing.
 */
export const getGoogleBookById = async (volumeId: string) => {
  if (!process.env.GOOGLE_BOOKS_API_KEY) {
    console.error("Missing Google Books API Key");
    throw new Error("Google Books API Key is not configured.");
  }

  try {
    console.log(`Fetching details for book ID: ${volumeId}`);
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/${volumeId}`, {
      params: { key: process.env.GOOGLE_BOOKS_API_KEY },
    });

    if (!response.data) {
      console.warn(`No details found for book ID: ${volumeId}`);
      throw new Error("Book details not found.");
    }

    console.log(`Book details fetched successfully for ID: ${volumeId}`);
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
    console.error(`Google Books API error (Get by ID): ${error.message}`);
    throw new Error("Failed to fetch book details from Google Books API.");
  }
};
