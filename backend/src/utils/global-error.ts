import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';

interface CustomError extends Error {
  statusCode?: number;
}

export function globalErrorHandler(
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      errors: err.errors,
    });
    return;
  }

  // Handle JWT token expiration errors
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      errors: ['Token expired'],
    });
    return;
  }

  // Handle JWT invalid token errors
  if (err instanceof JsonWebTokenError) {
    res.status(401).json({
      errors: ['Invalid token'],
    });
    return;
  }

  // Handle custom errors with statusCode
  if (err.statusCode) {
    res.status(err.statusCode).json({
      errors: [err.message],
    });
    return;
  }

  console.error('Unhandled error:', err);

  // Default error response
  res.status(500).json({
    errors: ['Internal Server Error'],
  });
}
