export interface User {
    id: string,
    username: string,
    email: string,
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