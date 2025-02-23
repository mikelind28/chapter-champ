// this will hold the query GET_ME, which will execute the me query set up using Apollo Server

import { gql } from '@apollo/client';

export const GET_ME = gql`
    query me {
        me {
            username
            email
            favoriteCount
            wantToReadCount
            currentlyReadingCount
            finishedReadingCount
            savedBooks {
                status
                bookDetails {
                    id
                    title
                    authors
                    description
                    thumbnail
                    pageCount
                    categories
                    averageRating
                    ratingsCount
                    infoLink
                }
            }
        }
    }
`;

export const SEARCH_GOOGLE_BOOKS = gql`
    query searchGoogleBooks($query: string) {
        searchGoogleBooks(query: $query) {
            _id
            id
            title
            authors
            description
            thumbnail
            pageCount
            categories
            averageRating
            ratingsCount
            infoLink
        }
    }
`;