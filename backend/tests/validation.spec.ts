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

    it('should throw an error for invalid identifier data', () => {
      const invalidData = {
        identifier: 'username',
        password: 'password123',
        type: 'invalidType',
      };
      expect(() => loginZodSchema.parse(invalidData)).toThrow();
    });

    it('should throw an error for invalid password data', () => {
      const invalidData = {
        identifier: 'username',
        password: 'pass',
        type: 'username',
      };
      expect(() => loginZodSchema.parse(invalidData)).toThrow();
    });

    it('should throw an error for invalid username data', () => {
      const invalidData = {
        identifier: 's',
        password: 'password123',
        type: 'username',
      };
      expect(() => loginZodSchema.parse(invalidData)).toThrow();
    });

    it('should throw an error for invalid email data', () => {
      const invalidData = {
        identifier: 'noEmail',
        password: 'password123',
        type: 'email',
      };
      expect(() => loginZodSchema.parse(invalidData)).toThrow();
    });

    it('should throw an error for injection-characters in username data', () => {
      const invalidData = {
        identifier: '<testuser>',
        password: 'password123',
        type: 'username',
      };
      expect(() => loginZodSchema.parse(invalidData)).toThrow();
    });

    it('should throw an error for injection-characters in password data', () => {
      const invalidData = {
        identifier: 'test@example.com',
        password: '<<password123>',
        type: 'email',
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

    it('should throw an error for invalid email data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'pass',
        username: 'testuser',
      };
      await expect(createUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });

    it('should throw an error for invalid username data', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'pass',
        username: 'te',
      };
      await expect(createUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });

    it('should throw an error for invalid password data', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'pass',
        username: 'testuser',
      };
      await expect(createUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });

    
    it('should throw an error for injection-characters in username data', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password',
        username: '<testuser>',
      };
      await expect(createUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });

    
    it('should throw an error for injection-characters in password data', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '<<password>',
        username: 'testuser',
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

    it('should throw an error for invalid email data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        username: 'testuser',
      };
      await expect(updateUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });

    it('should throw an error for invalid password data', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'pass',
        username: 'testuser',
      };
      await expect(updateUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });

    it('should throw an error for invalid username data', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'te',
      };
      await expect(updateUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });

    it('should throw an error for injection-characters in username data', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123',
        username: '<Peter>>>',
      };
      await expect(updateUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });

    it('should throw an error for injection-characters in password data', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '<<password123',
        username: 'testuser',
      };
      await expect(updateUserZodSchema.parseAsync(invalidData)).rejects.toThrow();
    });
  });
});