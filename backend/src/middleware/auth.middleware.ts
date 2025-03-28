import { NextFunction, Request, RequestHandler, Response } from 'express';
import { DI } from '../dependency-injection';

export const prepareAuthentication = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.get('Authorization');
  if (authHeader) {
    const token = DI.utils.jwt.verifyToken(authHeader);
    const user = await DI.repositories.user.getUserById(token.id);
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
  }
  next();
};

export const verifyAccess: RequestHandler = (req: Request, res, next) => {
  if (!req.user) {
    res.status(401).json({ errors: ['No or invalid authentication provided'] });
    return;
  }
  next();
};

export const verifyAdminAccess: RequestHandler = (req: Request, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403).json({ errors: ['Access denied: Admins only'] });
    return;
  }
  next();
};
