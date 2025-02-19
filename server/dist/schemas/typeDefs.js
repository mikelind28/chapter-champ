const typeDefs = `
    type Book {
        _id: ID
    }

    type User {
        _id: ID
        email: String
        password: String
    }

    type Auth {
        token: ID!
        user: User
    }


    input UserInput {
        email: String!
        password: String!
    }

    type Query {
        me: User
    }

    type Mutation {
        addUser(input: UserInput!): Auth
        login(email: String!, password: String!): Auth
    }
`;
export default typeDefs;
