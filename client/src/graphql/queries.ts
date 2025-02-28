// this will hold the query GET_ME, which will execute the me query set up using Apollo Server

import { gql } from '@apollo/client';

// retrieve a logged-in user's information
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
                    bookId
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

// search the Google Books API
export const SEARCH_GOOGLE_BOOKS = gql`
    query searchGoogleBooks($query: String!) {
        searchGoogleBooks(query: $query) {
            bookId
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

// get all users feature for admin user
export const GET_USERS = gql`
    query getUsers {
        getUsers {
            _id
            username
            email
            currentlyReadingCount
            favoriteCount
            finishedReadingCount
            wantToReadCount
            bookCount
            isAdmin
         }
    }
`;