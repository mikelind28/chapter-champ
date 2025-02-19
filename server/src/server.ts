import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/api/serverAPI.js';
import type { Request, Response } from 'express';
import db from './config/connection.js';
import { ApolloServer } from '@apollo/server'; 
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const startApolloServer = async () => {
    await server.start();
    await db();

    const app = express();
    const PORT = process.env.PORT || 3001;

    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/api', apiRoutes);
    app.use('/graphql', expressMiddleware(server as any,
        {
          context: authenticateToken as any
        }
    ));

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../../client/dist')));
    
        app.get('*', (_req: Request, res: Response) => {
          res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
        });
      }

    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
}

startApolloServer();
