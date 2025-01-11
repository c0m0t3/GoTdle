import { loginZodSchema, createUserZodSchema, updateUserZodSchema } from '../src/validation/validation';

jest.mock('../src/dependency-injection', () => ({
  DI: {
    utils: {
      passwordHasher: {
        hashPassword: jest.fn((password: string) => Promise.resolve(`hashed-${password}`)),
      },
    },
  },
}));

describe('Validation Schemas', () => {
  describe('loginZodSchema', () => {
    it('should validate a valid email login', () => {
      const result = loginZodSchema.safeParse({
        type: 'email',
        identifier: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should validate a valid username login', () => {
      const result = loginZodSchema.safeParse({
        type: 'username',
        identifier: 'testuser',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should invalidate an invalid email login', () => {
      const result = loginZodSchema.safeParse({
        type: 'email',
        identifier: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should invalidate an invalid username login', () => {
      const result = loginZodSchema.safeParse({
        type: 'username',
        identifier: 'us',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should invalidate a login with forbidden characters in password', () => {
      const result = loginZodSchema.safeParse({
        type: 'username',
        identifier: 'testuser',
        password: 'password123<',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('createUserZodSchema', () => {
    it('should validate a valid user creation', async () => {
      const result = await createUserZodSchema.safeParseAsync({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      });
      expect(result.success).toBe(true);
    });

    it('should invalidate a user creation with invalid email', async () => {
      const result = await createUserZodSchema.safeParseAsync({
        email: 'invalid-email',
        password: 'password123',
        username: 'testuser',
      });
      expect(result.success).toBe(false);
    });

    it('should invalidate a user creation with forbidden characters in username', async () => {
      const result = await createUserZodSchema.safeParseAsync({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser<',
      });
      expect(result.success).toBe(false);
    });

    it('should invalidate a user creation with forbidden characters in password', async () => {
      const result = await createUserZodSchema.safeParseAsync({
        email: 'test@example.com',
        password: 'password123<',
        username: 'testuser',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('updateUserZodSchema', () => {
    it('should validate a valid user update', async () => {
      const result = await updateUserZodSchema.safeParseAsync({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      });
      expect(result.success).toBe(true);
    });

    it('should invalidate a user update with invalid email', async () => {
      const result = await updateUserZodSchema.safeParseAsync({
        email: 'invalid-email',
        password: 'password123',
        username: 'testuser',
      });
      expect(result.success).toBe(false);
    });

    it('should invalidate a user update with forbidden characters in username', async () => {
      const result = await updateUserZodSchema.safeParseAsync({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser<',
      });
      expect(result.success).toBe(false);
    });

    it('should invalidate a user update with forbidden characters in password', async () => {
      const result = await updateUserZodSchema.safeParseAsync({
        email: 'test@example.com',
        password: 'password123<',
        username: 'testuser',
      });
      expect(result.success).toBe(false);
    });
  });
});