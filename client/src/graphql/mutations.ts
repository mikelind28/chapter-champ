import { gql } from '@apollo/client';

// logs in user when given correct email and password
export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                email
            }
        }
    }
`;

// creates a new user upon signup
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
        token
        user {
            _id
            email
        }
    }
}
`;

// allows a user to update their account's username and email from account page
export const UPDATE_USER = gql`
  mutation UpdateUser($username: String!, $email: String!) {
    updateUser(username: $username, email: $email) {
      _id
      username
      email
    }
  }
`;

// admin users can remove existing users
export const REMOVE_USER = gql`
  mutation RemoveUser($userId: ID!) {
    removeUser(userId: $userId) {
      _id
    }
  }
`;

// saves a book to a user's account
export const SAVE_BOOK = gql`
  mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
      _id
      savedBooks {
        bookDetails {
          bookId
          title
        }
        status
      }        
    }
  }
`;

// users can change the reading status of their book (finished reading, currently reading, etc.)
export const UPDATE_BOOK_STATUS = gql`
  mutation updateBookStatus($bookId: String!, $status: ReadingStatus!) {
    updateBookStatus(bookId: $bookId, status: $status) {
      _id
      savedBooks {
        bookDetails {
          bookId
          title
        }
        status
      }
    }
  }
`;

// users can remove a book entirely from their shelf
export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      _id
      username
      savedBooks {
        bookDetails {
          bookId
        }
      }
    }
  }
`;