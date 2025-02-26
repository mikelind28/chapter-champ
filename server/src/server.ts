import cors from "cors";
import express, { Request, Response } from "express";
import apiRoutes from "./routes/api/serverAPI.js";
import db from "./config/connection.js";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs, resolvers } from "./schemas/index.js";
import { authenticateToken } from "./utils/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ApolloContext {
  user: { _id: string; username: string } | null;
}

const server = new ApolloServer({ typeDefs, resolvers });

const startApolloServer = async () => {
  if (!process.env.JWT_SECRET || !process.env.GOOGLE_BOOKS_API_KEY) {
    throw new Error("Essential environment variables are missing.");
  }

  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;

  // Improved CORS handling
  app.use(
    cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" })
  );
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use("/api", apiRoutes);

  // Enhanced authentication context with error handling
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }): Promise<ApolloContext> => {
        try {
          // Extract the operation name (e.g., login, addUser, etc.)
          const operationName = req.body?.operationName;
  
          // Skip authentication for login and addUser mutations
          if (["login", "addUser"].includes(operationName)) {
            console.log(`Skipping token check for ${operationName}`);
            return { user: null };
          }
  
          // For all other operations, authenticate
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

  // Serve frontend in production with logging
  if (process.env.NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "../../client/dist");
    console.log(`Resolved clientPath: ${clientPath}`);
    app.use(express.static(clientPath));
    app.get("*", (_req: Request, res: Response) =>
      res.sendFile(path.join(clientPath, "index.html"))
    );
  }

  // Health check endpoint
  app.get("/health", (_req: Request, res: Response) =>
    res.status(200).send("Server is healthy!")
  );

  // Global error handler
  app.use(errorHandler);

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
};

startApolloServer();
