import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

// export const ADD_USER = gql`
//   mutation addUser($input: UserInput!) {
//     addUser(input: $input) {
//         user {
//             username
//             _id
//         }
//         token
//     }
// }
// `;

// export const SAVE_BOOK = gql`
//     mutation saveBook($input: BookInput!) {
//     saveBook(input: $input) {
//       _id
//     }
//   }
// `;

// export const REMOVE_BOOK = gql`
//     mutation removeBook($bookKey: String!) {
//     removeBook(bookKey: $bookKey) {
//       _id
//       username
//       savedBooks {
//         _id
//         bookKey
//       }
//     }
//   }
// `;