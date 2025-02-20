import { Request, Response, NextFunction } from 'express';
import { prepareAuthentication, verifyAccess } from '../src/middleware/auth.middleware';
import { DI } from '../src/dependency-injection';

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

describe('prepareAuthentication', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {
      get: jest.fn(),
    };
    mockRes = {};
    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  it('should add user and token to the request if authentication is valid', async () => {
    const token = { id: 'user-id' };
    const user = { id: 'user-id', name: 'Test User' };

    (mockReq.get as jest.Mock).mockReturnValue('Bearer valid-token');
    (DI.utils.jwt.verifyToken as jest.Mock).mockReturnValue(token);
    (DI.repositories.user.getUserById as jest.Mock).mockResolvedValue(user);

    await prepareAuthentication(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.user).toEqual(user);
    expect(mockReq.token).toEqual(token);
    expect(mockNext).toHaveBeenCalled();
  });

  it('should throw an error if user is not found', async () => {
    const token = { id: 'invalid-user-id' };

    (mockReq.get as jest.Mock).mockReturnValue('Bearer valid-token');
    (DI.utils.jwt.verifyToken as jest.Mock).mockReturnValue(token);
    (DI.repositories.user.getUserById as jest.Mock).mockResolvedValue(null);

    await expect(prepareAuthentication(mockReq as Request, mockRes as Response, mockNext))
      .rejects
      .toThrow('User not found');

    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if no Authorization header is present', async () => {
    (mockReq.get as jest.Mock).mockReturnValue(null);

    await prepareAuthentication(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
  it('should throw an error if token is invalid', async () => {
    (mockReq.get as jest.Mock).mockReturnValue('Bearer invalid-token');
    (DI.utils.jwt.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(prepareAuthentication(mockReq as Request, mockRes as Response, mockNext))
      .rejects
      .toThrow('Invalid token');

    expect(mockNext).not.toHaveBeenCalled();
  });
  it('should call next if token verification fails', async () => {
    (mockReq.get as jest.Mock).mockReturnValue('Bearer valid-token');
    (DI.utils.jwt.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error('Token verification failed');
    });

    await expect(prepareAuthentication(mockReq as Request, mockRes as Response, mockNext))
      .rejects
      .toThrow('Token verification failed');

    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('verifyAccess', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should return 401 if user is not present in the request', () => {
    verifyAccess(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ errors: ['No or invalid authentication provided'] });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if user is present in the request', () => {
    mockReq.user = { id: 'user-id', name: 'Test User' };

    verifyAccess(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });
});
