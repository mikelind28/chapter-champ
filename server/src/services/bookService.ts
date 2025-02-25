import axios from 'axios';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Search for books using the Google Books API.
 * @param query - Search term (title, author, etc.).
 * @param maxResults - Number of books to return.
 * @returns A list of books matching the query.
 */
export const searchGoogleBooks = async (query: string, maxResults: number = 10) => {
  try {
    const response = await axios.get(GOOGLE_BOOKS_BASE_URL, {
      params: {
        q: query,
        maxResults,
        key: process.env.GOOGLE_BOOKS_API_KEY,
      },
    });

    return response.data.items?.map((book: any) => ({
      bookId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      description: book.volumeInfo.description || 'No description available.',
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
      pageCount: book.volumeInfo.pageCount || 0,
      categories: book.volumeInfo.categories || [],
      averageRating: book.volumeInfo.averageRating || 0,
      ratingsCount: book.volumeInfo.ratingsCount || 0,
      infoLink: book.volumeInfo.infoLink || '',
    })) || [];
  } catch (error) {
    console.error(`Google Books API error: ${error}`);
    throw new Error('Failed to fetch books from Google Books API.');
  }
};

/**
 * Fetch detailed information about a specific book by volume ID.
 * @param volumeId - The Google Books volume ID.
 * @returns Book details.
 */
export const getGoogleBookById = async (volumeId: string) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/${volumeId}`, {
      params: { key: process.env.GOOGLE_BOOKS_API_KEY },
    });

    const book = response.data;
    return {
      bookId: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      description: book.volumeInfo.description || 'No description available.',
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
      pageCount: book.volumeInfo.pageCount || 0,
      categories: book.volumeInfo.categories || [],
      averageRating: book.volumeInfo.averageRating || 0,
      ratingsCount: book.volumeInfo.ratingsCount || 0,
      infoLink: book.volumeInfo.infoLink || '',
    };
  } catch (error) {
    console.error(`Google Books API error: ${error}`);
    throw new Error('Failed to fetch book details from Google Books API.');
  }
};