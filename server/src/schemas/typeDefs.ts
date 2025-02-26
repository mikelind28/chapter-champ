import { gql } from "apollo-server-express";

const typeDefs = gql`
  """
  Enum representing the reading status of a book in the user's library.
  """
  enum ReadingStatus {
    WANT_TO_READ                                  # Book added but not started yet
    CURRENTLY_READING                             # Book currently being read
    FINISHED_READING                              # Book finished by the user
    FAVORITE                                      # Book marked as a favorite
  }

  """
  Represents a user in the application, including their saved books and book counts.
  """
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [SavedBook]                       # User's personal library with book details and reading status
    bookCount: Int                                # Virtual property showing the total number of saved books
    favoriteCount: Int                            # Virtual property showing the total number of favorite books
    wantToReadCount: Int                          # Virtual property showing the total number of want-to-read books
    currentlyReadingCount: Int                    # Virtual property showing the total number of books currently reading 
    finishedReadingCount: Int                     # Virtual property showing the total number of finished books
  }

  """
  Represents detailed information about a book.
  """
  type BookDetails {
    bookId: String!                               # Unique identifier for the book (Google Books API ID)
    title: String!                                # Title of the book
    authors: [String]                             # List of authors
    description: String                           # Book description
    thumbnail: String                             # URL to the book's thumbnail image
    pageCount: Int                                # Total number of pages
    categories: [String]                          # Genres or categories of the book
    averageRating: Float                          # Average rating from Google Books
    ratingsCount: Int                             # Total number of ratings
    infoLink: String                              # URL to more information about the book
  }

  """
  Represents a saved book entry in the user's library, including the reading status.
  """
  type SavedBook {
    bookDetails: BookDetails!                     # Book details object
    status: ReadingStatus!                        # Current reading status of the book
  }

  """
  Auth object returned after user registration or login.
  """
  type Auth {
    token: ID!                                    # JWT token for authentication
    user: User                                    # User object associated with the token
  }

  """
  Input type for adding a book to the user's library.
  """
  input BookInput {
  bookId: String!
  title: String!
  authors: [String]
  description: String
  thumbnail: String
  pageCount: Int
  categories: [String]
  averageRating: Float
  ratingsCount: Int
  infoLink: String
  status: ReadingStatus!
  }

  """
  Queries available in the application.
  """
  type Query {
    # Retrieves the currently authenticated user's data
    me: User

    # Retrieves a user by ID or username
    getSingleUser(id: ID, username: String): User

    # Retrieves all users
    getUsers: [User]!

    # Search Google Books API with all specified response fields
    searchGoogleBooks(query: String!): [BookDetails]

    # Get Google Books by ID
    getGoogleBookById(volumeId: String!): BookDetails

    # Admin-Only: Fetch all users
    getAllUsers: [User]!
  }

  """
  Mutations for user authentication and book library management.
  """
  type Mutation {
    # Registers a new user and returns the authentication token
    addUser(username: String!, email: String!, password: String!): Auth

    # Logs in a user and returns a signed JWT token
    login(email: String!, password: String!): Auth

    # Saves a book to the user's library with a specified reading status
    saveBook(input: BookInput!): User

    # Updates the reading status of a saved book in the user's library
    updateBookStatus(bookId: String!, status: ReadingStatus!): User

    # Removes a book from the user's library by its ID
    removeBook(bookId: String!): User

    # Admin-Only: Promote User to Admin
    promoteUser(userId: ID!): User
  }
`;

export default typeDefs;
