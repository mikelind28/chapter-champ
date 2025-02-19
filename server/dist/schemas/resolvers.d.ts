import { User } from '../models/index.js';
interface User {
    _id: string;
    email: string;
    password: string;
}
interface AddUserArgs {
    input: {
        email: string;
        password: string;
    };
}
interface LoginUserArgs {
    email: string;
    password: string;
}
interface Context {
    user?: User;
}
declare const resolvers: {
    Query: {
        me: (_parent: any, _args: any, context: Context) => Promise<(import("mongoose").Document<unknown, {}, import("../models/User.js").UserDocument> & import("../models/User.js").UserDocument & Required<{
            _id: string;
        }> & {
            __v: number;
        }) | null>;
    };
    Mutation: {
        addUser: (_parent: any, { input }: AddUserArgs) => Promise<{
            token: string;
            user: User;
        }>;
        login: (_parent: any, { email, password }: LoginUserArgs) => Promise<{
            token: string;
            user: import("mongoose").Document<unknown, {}, import("../models/User.js").UserDocument> & import("../models/User.js").UserDocument & Required<{
                _id: string;
            }> & {
                __v: number;
            };
        }>;
    };
};
export default resolvers;
