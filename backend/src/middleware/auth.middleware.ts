import { NextFunction, Request, RequestHandler, Response } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { DI } from '../dependency-injection';

export const prepareAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    try {
      const token = DI.utils.jwt.verifyToken(authHeader.replace('Bearer ', ''));
      const user = await DI.repositories.user.getUserById(token.id);
      if (!user) {
        throw new Error('User not found');
      }

      req.user = user;
      req.token = token;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        console.error('Token expired:', error);
        res.status(401).json({ errors: ['Token expired'] });
        return;
      } else {
        console.error('Token verification error:', error);
        res.status(401).json({ errors: ['Invalid token'] });
        return;
      }
    }
  }
  next();
};

export const verifyAccess: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    res.status(401).json({ errors: ['No or invalid authentication provided'] });
    return;
  }
  next();
};
