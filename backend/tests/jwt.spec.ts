import jwt from 'jsonwebtoken';
import { Jwt } from '../src/utils/jwt';

jest.mock('jsonwebtoken');

describe('Jwt', () => {
  const secret = 'test-secret';
  const options = { expiresIn: '1h' };
  const jwtInstance = new Jwt(secret, options);
  const payload = { id: '123', email: 'test@example.com', username: 'testuser' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      (jwt.sign as jest.Mock).mockReturnValue('test-token');

      const token = jwtInstance.generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, secret, options);
      expect(token).toBe('test-token');
    });
  });

  describe('verifyToken', () => {
    it('should verify a token and return the payload', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ ...payload, iat: 1234567890 });

      const token = 'test-token';
      const result = jwtInstance.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, secret);
      expect(result).toEqual({ ...payload, iat: 1234567890 });
    });

    it('should throw an error if token is invalid', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new jwt.JsonWebTokenError('invalid token');
      });

      const token = 'invalid-token';

      expect(() => jwtInstance.verifyToken(token)).toThrow('');
    });
  });
});