import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Initializes an Express router with necessary middlewares.
 * This file serves as the main API entry point for route definitions.
 */
const router = express.Router();

// Middleware: Parses incoming JSON requests
router.use(express.json());

/**
 * Default route to verify that the server is running.
 */
router.get('/', (_req, res) => {
  res.status(200).json({ message: 'API is running' });
});

export default router;