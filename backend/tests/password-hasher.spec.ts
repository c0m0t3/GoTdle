import bcrypt from 'bcrypt';
import { PasswordHasher } from '../src/utils/password-hasher';

jest.mock('bcrypt');

describe('PasswordHasher', () => {
  const salt = 10;
  const passwordHasher = new PasswordHasher(salt);
  const password = 'password123';
  const hash = 'hashed-password';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      (bcrypt.hashSync as jest.Mock).mockReturnValue(hash);

      const result = await passwordHasher.hashPassword(password);

      expect(bcrypt.hashSync).toHaveBeenCalledWith(password, salt);
      expect(result).toBe(hash);
    });
  });

  describe('comparePasswordWithHash', () => {
    it('should return true if password matches hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await passwordHasher.comparePasswordWithHash(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(true);
    });

    it('should return false if password does not match hash', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await passwordHasher.comparePasswordWithHash(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });

    it('should return false if an error occurs', async () => {
      (bcrypt.compare as jest.Mock).mockImplementation(() => {
        throw new Error('compare error');
      });

      const result = await passwordHasher.comparePasswordWithHash(password, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hash);
      expect(result).toBe(false);
    });
  });
});