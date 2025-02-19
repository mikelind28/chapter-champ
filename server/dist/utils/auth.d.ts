import { GraphQLError } from 'graphql';
export declare const authenticateToken: ({ req }: any) => any;
export declare const signToken: (email: string, _id: unknown) => string;
export declare class AuthenticationError extends GraphQLError {
    constructor(message: string);
}
