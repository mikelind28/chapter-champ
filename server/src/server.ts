import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { fileURLToPath } from "url";
import db from "./config/connection.js";
import { typeDefs, resolvers } from "./schemas/index.js";
import { authenticateToken } from "./utils/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Type for Apollo Context
export interface ApolloContext {
  user: { _id: string; username: string } | null;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  try {
    // Validate essential environment variables
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables");
    }

    await server.start();
    await db();

    const PORT = process.env.PORT || 3001;
    const app = express();

    // CORS setup
    app.use(
      cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" })
    );

    // Middleware for parsing
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Apollo GraphQL middleware with authentication
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req }: { req: Request }): Promise<ApolloContext> => {
          try {
            const context = authenticateToken({ req });
            console.log(
              process.env.NODE_ENV === "development"
                ? `Authenticated user: ${JSON.stringify(context.user)}`
                : ""
            );
            return { user: context.user || null };
          } catch (error) {
            console.error("Error authenticating token:", error);
            return { user: null };
          }
        },
      })
    );

    // Serve React static files in production
    if (process.env.NODE_ENV === "production") {
      const clientPath = path.join(__dirname, "../../client/dist");
      console.log(`Resolved clientPath: ${clientPath}`);
      app.use(express.static(clientPath));

      app.get("*", (_req: Request, res: Response) => {
        res.sendFile(path.join(clientPath, "index.html"));
      });
    }

    // Health check endpoint
    app.get("/health", (_req: Request, res: Response) => {
      res.status(200).send("Server is healthy!");
    });

    // Error handler middleware
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Unhandled error:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });

    // Custom global error handler
    app.use(errorHandler);

    // Start server
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("Shutting down gracefully...");
      await server.stop();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startApolloServer();
