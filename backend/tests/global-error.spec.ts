import { Request, Response, NextFunction } from 'express';
import { globalErrorHandler } from '../src/utils/global-error';
import { ZodError } from 'zod';
import { TokenExpiredError } from 'jsonwebtoken';

describe('Global Error Handler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  }, 50000);

  it('should handle Zod validation errors', () => {
    const error = new ZodError([]);
    globalErrorHandler(error, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ errors: error.errors });
  });

  it('should handle JWT token expiration errors', () => {
    const error = new TokenExpiredError('jwt expired', new Date());
    globalErrorHandler(error, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ errors: ['Token expired'] });
  });

  it('should handle other errors', () => {
    const error = new Error('Test error');
    globalErrorHandler(error, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ errors: ['Internal Server Error'] });
  });
});