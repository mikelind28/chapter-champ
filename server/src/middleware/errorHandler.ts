import { Request, Response, NextFunction } from 'express';

/**
 * Centralized error handling middleware.
 * Captures errors from all parts of the application and sends a consistent response.
 *
 * @param err - Error object, potentially including a status code.
 * @param _req - Express Request object (unused here).
 * @param res - Express Response object for sending the error response.
 * @param _next - Express NextFunction (unused here, but required for middleware signature).
 */
export const errorHandler = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const timestamp = new Date().toISOString();

  console.error(`[${timestamp}] Error: ${err.message}`);
  if (process.env.NODE_ENV === 'development' && err.stack) {
    console.error(`[STACK TRACE] ${err.stack}`);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Utility function to create custom errors with status codes.
 *
 * @param message - Error message to be displayed.
 * @param statusCode - HTTP status code associated with the error (default is 500).
 * @returns A custom error object with a status code.
 */
export const createError = (message: string, statusCode = 500) => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};