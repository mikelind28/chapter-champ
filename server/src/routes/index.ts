import type { Request, Response } from 'express';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import apiRoutes from './api/serverAPI.js';

const router = express.Router();

// Resolve __dirname when using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @description Mount API routes under the '/api' path
 */
router.use('/api', apiRoutes);

/**
 * @description Serve React frontend in production.
 * If the requested route does not match any API route,
 * the React app's index.html is served instead (for client-side routing).
 */
router.use((_req: Request, res: Response) => {
  const indexPath = path.join(__dirname, '../../client/build/index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving React frontend:', err);
      res.status(500).send('Internal Server Error: React frontend not found.');
    }
  });
});

export default router;