import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';
dotenv.config();

export const authenticateToken = ({ req }: any) => {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // If the token is sent in the authorization header, extract the token from the header
  if (req.headers.authorization) {
    // Handle both "Bearer <token>" and raw token
    if (token.startsWith("Bearer ")) {
      token = token.split(' ')[1].trim();
    }
  }

  // If no token is provided, return the request object as is
  if (!token) {
    console.log(`No token provided for ${req.body.operationName}.`);
    return req;
  }

  // Try to verify the token
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "", {
      maxAge: "2h",
    });
    req.user = decoded.data;
    console.log("Token verified. User:", req.user);
  } catch (err) {
    console.error("Invalid token:", err);
  }

  // Return the request object
  return req;
};

export const signToken = (username: string, email: string, _id: unknown, isAdmin: boolean) => {
  // Create a payload with the user information
  const payload = { username, email, _id, isAdmin};
  const secretKey: any = process.env.JWT_SECRET;

  // Sign the token with the payload and secret key, and set it to expire in 2 hours
  return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};

export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, undefined, undefined, undefined, ['UNAUTHENTICATED']);
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
};
