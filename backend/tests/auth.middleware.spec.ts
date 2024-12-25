import request from 'supertest';
import express, { Request, Response } from 'express';
import { prepareAuthentication, verifyAccess } from '../src/middleware/auth.middleware';
import { DI } from '../src/dependency-injection';
import { TokenExpiredError } from 'jsonwebtoken';

jest.mock('../src/dependency-injection', () => ({
  DI: {
    utils: {
      jwt: {
        verifyToken: jest.fn(),
      },
    },
    repositories: {
      user: {
        getUserById: jest.fn(),
      },
    },
  },
}));

describe('Auth Middleware', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    app.get('/protected', prepareAuthentication, (_req: Request, res: Response) => {
      res.status(200).json({ message: 'Protected route accessed' });
    });

    app.get('/verify', verifyAccess, (_req: Request, res: Response) => {
      res.status(200).json({ message: 'Access verified' });
    });
  }, 50000);

  beforeEach(() => {
    jest.clearAllMocks();
  });


  describe('prepareAuthentication', () => {
    it('should set user and token on request if valid token is provided', async () => {
      const mockToken = { id: '123' };
      const mockUser = { id: '123', name: 'Test User' };

      (DI.utils.jwt.verifyToken as jest.Mock).mockReturnValue(mockToken);
      (DI.repositories.user.getUserById as jest.Mock).mockResolvedValue(mockUser);

      await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer valid-token')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Protected route accessed');
        });

      expect(DI.utils.jwt.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(DI.repositories.user.getUserById).toHaveBeenCalledWith(mockToken.id);
    });

    it('should return 401 if token is expired', async () => {
      (DI.utils.jwt.verifyToken as jest.Mock).mockImplementation(() => {
        throw new TokenExpiredError('jwt expired', new Date());
      });

      await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer expired-token')
        .expect(401)
        .expect((res) => {
          expect(res.body.errors).toContain('Token expired');
        });

      expect(DI.utils.jwt.verifyToken).toHaveBeenCalledWith('expired-token');
    });

    it('should return 401 if token is invalid', async () => {
      (DI.utils.jwt.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)
        .expect((res) => {
          expect(res.body.errors).toContain('Invalid token');
        });

      expect(DI.utils.jwt.verifyToken).toHaveBeenCalledWith('invalid-token');
    });

    it('should call next if no authorization header is provided', async () => {
      await request(app)
        .get('/protected')
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toBe('Protected route accessed');
        });

      expect(DI.utils.jwt.verifyToken).not.toHaveBeenCalled();
      expect(DI.repositories.user.getUserById).not.toHaveBeenCalled();
    });
  });

  describe('verifyAccess', () => {
    it('should call next if user is authenticated', async () => {
      const mockUser = { id: '123', name: 'Test User' };

      const req = {
        user: mockUser,
      } as Request;
      const res = {} as Response;
      const next = jest.fn();

      verifyAccess(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> & { status: jest.Mock; json: jest.Mock };
      const next = jest.fn();

      verifyAccess(req, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ errors: ['No or invalid authentication provided'] });
      expect(next).not.toHaveBeenCalled();
    });
  });
});