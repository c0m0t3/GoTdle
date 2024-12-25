import { excludeInjectionChars, loginZodSchema, createUserZodSchema, updateUserZodSchema } from '../src/validation/validation';

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
  describe('excludeInjectionChars', () => {
    it('should throw an error if input contains forbidden characters', () => {
      const forbiddenInputs = ["test'", 'test;', 'test<', 'test>', 'test&'];
      forbiddenInputs.forEach(input => {
        expect(() => excludeInjectionChars(input)).toThrow('Input contains forbidden characters');
      });
    });

    it('should return the input if it does not contain forbidden characters', () => {
      const validInput = 'validInput';
      expect(excludeInjectionChars(validInput)).toBe(validInput);
    });
  });

  describe('loginZodSchema', () => {
    it('should validate a valid email login', () => {
      const validData = {
        identifier: 'test@example.com',
        password: 'password123',
        type: 'email',
      };
      expect(() => loginZodSchema.parse(validData)).not.toThrow();
    });

    it('should validate a valid username login', () => {
      const validData = {
        identifier: 'testuser',
        password: 'password123',
        type: 'username',
      };
      expect(() => loginZodSchema.parse(validData)).not.toThrow();
    });

    it('should throw an error for invalid login data', () => {
      const invalidData = {
        identifier: 'te',
        password: 'pass',
        type: 'username',
      };
      expect(() => loginZodSchema.parse(invalidData)).toThrow();
    });
  });

  describe('createUserZodSchema', () => {
    it('should validate and transform valid user data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };
      const result = await createUserZodSchema.parseAsync(validData);
      expect(result).toEqual({
        ...validData,
        password: `hashed-${validData.password}`,
      });
    });

    it('should throw an error for invalid user data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'pass',
        username: 'te',
      };
      await expect(createUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });
  });

  describe('updateUserZodSchema', () => {
    it('should validate and transform valid user data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      };
      const result = await updateUserZodSchema.parseAsync(validData);
      expect(result).toEqual({
        ...validData,
        password: `hashed-${validData.password}`,
      });
    });

    it('should throw an error for invalid user data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'pass',
        username: 'te',
      };
      await expect(updateUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });
  });
});