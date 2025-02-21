import { gql } from 'apollo-server-express';

const typeDefs = gql`
type User {
  _id: ID!
  username: String!
  email: String!
  # Placeholder: Virtual bookCount for total books in library
  bookCount: Int
  # Placeholder: User's personal library with reading status for each book
  # Example: savedBooks: [Book]
}

  type Book {
    id: String!                     
    title: String!                  
    authors: [String]               
    description: String             
    thumbnail: String               
    pageCount: Int                  
    categories: [String]            
    averageRating: Float            
    ratingsCount: Int               
    infoLink: String                
  }

  type Auth {
    token: ID!
    user: User
  }

  # Input type for saving a book to user's library
  input BookInput {
    id: String!
    title: String!
    authors: [String]
    description: String
    thumbnail: String
    pageCount: Int
    categories: [String]
    averageRating: Float
    ratingsCount: Int
    infoLink: String
  }

  type Query {
    # Retrieves the current logged-in user
    me: User

    # Retrieve user by ID or username
    getSingleUser(id: ID, username: String): User

    # Search Google Books API with all specified response fields
    searchGoogleBooks(query: String!): [Book]

    # Get Google Books by ID
    getGoogleBookById(volumeId: String!): Book
  }

  type Mutation {
    # Register a new user
    addUser(username: String!, email: String!, password: String!): Auth

    # Login user and return token
    login(email: String!, password: String!): Auth

    # Placeholder: Save a book to user's library (with Google Books API fields)
    # Example: saveBook(input: BookInput!): User

    # Placeholder: Remove a book from user's library by book ID
    # Example: removeBook(bookId: String!): User
  }
`;

export default typeDefs;