export interface User {
    id: string,
    username: string,
    email: string,
    savedBooks: SavedBook[];            // Array of saved books
}

export interface Book {
    status: string,
    bookDetails: {
        bookId: string,
        title: string,
        authors: string[],
        description: string,
        thumbnail: string,
        pageCount: number,
        categories: string[],
        averageRating: number,
        ratingsCount: number,
        infoLink: string
    }
}

export interface SavedBook {            // SavedBook interface
    bookDetails: {
        bookId: string;
        title: string;
        authors: string[];
        description: string;
        thumbnail: string;
        pageCount: number;
        categories: string[];
        averageRating: number;
        ratingsCount: number;
        infoLink: string;
    };
    status: string;
}
