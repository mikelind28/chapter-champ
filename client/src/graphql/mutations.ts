import { gql } from '@apollo/client';

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

export const UPDATE_USER = gql`
  mutation UpdateUser($username: String!, $email: String!) {
    updateUser(username: $username, email: $email) {
      _id
      username
      email
    }
  }
`;

export const REMOVE_USER = gql`
  mutation RemoveUser($userId: ID!) {
    removeUser(userId: $userId) {
      _id
    }
  }
`;


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