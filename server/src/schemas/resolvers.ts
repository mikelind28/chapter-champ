import { searchGoogleBooks, getGoogleBookById } from '../services/bookService.js';

export const resolvers = {
  Query: {
    searchGoogleBooks: async (_parent: any, { query }: { query: string }) => {
      return await searchGoogleBooks(query);
    },
    getGoogleBookById: async (_parent: any, { volumeId }: { volumeId: string }) => {
      return await getGoogleBookById(volumeId);
    },
  },
};