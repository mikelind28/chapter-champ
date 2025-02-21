export interface User {
    id: string,
    username: string,
    email: string,
}

export interface Book {
    id: string,
    title: string,
    authors: string[],
    thumbnail: string,
    pageCount: number,
    categories: string[],
    averageRating: number,
    ratingsCount: number,
    infoLink: string
}