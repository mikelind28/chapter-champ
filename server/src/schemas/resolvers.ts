import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';

interface User {
    _id: string;
    email: string;
    password: string;
}
  
interface AddUserArgs {
    input:{
    email: string;
    password: string;
    }
}
  
interface LoginUserArgs {
    email: string;
    password: string;
}

interface Context {
    user?: User
}

const resolvers = {
    Query: {
        // get a user's info
        me: async (_parent: any, _args: any, context: Context) => {
            if (context.user) {
                console.log("Found userId:", context.user._id);
                return await User.findById(context.user._id).populate('savedBooks');
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },

    Mutation: {
        // add a new user
        addUser: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; user: User }> => {
            const user = await User.create({ ...input });
            const token = signToken(user.email, user._id);
            return { token, user };
        },
        // log a user in
        login: async (_parent: any, { email, password }: LoginUserArgs) => {
            // Find a user with the provided email
            const user = await User.findOne({ email });
            // If no user is found, throw an AuthenticationError
            if (!user) {
                throw new AuthenticationError("Could not find user with this email.");
            }
            // Check if the provided password is correct
            const correctPw = await user.isCorrectPassword(password);
            // If the password is incorrect, throw an AuthenticationError
            if (!correctPw) {
                throw new AuthenticationError('password authentication failed.');
            }
            // Sign a token with the user's information
            const token = signToken(user.email, user._id);
            // Return the token and the user
            return { token, user };
        },
    },
}

export default resolvers;
