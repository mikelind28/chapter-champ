import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
const resolvers = {
    Query: {
        // get a user's info
        me: async (_parent, _args, context) => {
            if (context.user) {
                console.log("Found userId:", context.user._id);
                return await User.findById(context.user._id).populate('savedBooks');
            }
            throw new AuthenticationError('Could not authenticate user.');
        },
    },
    Mutation: {
        // add a new user
        addUser: async (_parent, { input }) => {
            const user = await User.create({ ...input });
            const token = signToken(user.email, user._id);
            return { token, user };
        },
        // log a user in
        login: async (_parent, { email, password }) => {
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
};
export default resolvers;
