import { z } from 'zod';
import { loginZodSchema, createUserZodSchema, updateUserZodSchema, createCharacterZodSchema, updateDailyOrStreakZodSchema, updateScoreZodSchema } from '../src/validation/validation';

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

  describe('updateScoreZodSchema', () => {
    it('should validate a correct score update', () => {
      const validData = {
        streak: 5,
        longestStreak: 10,
        recentScores: [1, 2, 3],
      };

      expect(() => updateScoreZodSchema.parse(validData)).not.toThrow();
    });

    it('should fail validation for incorrect score update', () => {
      const invalidData = {
        streak: 'five',
        longestStreak: 10,
        recentScores: [1, 2, 3],
      };

      expect(() => updateScoreZodSchema.parse(invalidData)).toThrow(z.ZodError);
    });
    it('should fail validation for incorrect score update', () => {
      const invalidData = {
        streak: 5,
        longestStreak: 10,
        recentScores: [1, 2, 'three'],
      };

      expect(() => updateScoreZodSchema.parse(invalidData)).toThrow(z.ZodError);
    });
    it('should fail validation for incorrect score update', () => {
      const invalidData = {
        streak: 5,
        longestStreak: "10",
        recentScores: [1, 2, 5],
      };

      expect(() => updateScoreZodSchema.parse(invalidData)).toThrow(z.ZodError);
    });
  });
//ÜBERARBEITEN
  describe('updateDailyOrStreakZodSchema', () => {
    it('should validate a correct daily score update', () => {
      const validData = {
        dailyScore: [1, 2, 3],
      };

      expect(() => updateDailyOrStreakZodSchema.parse(validData)).not.toThrow();
    });

    it('should fail validation for incorrect daily score update', () => {
      const invalidData = {
        dailyScore: [1, 'two', 3],
      };

      expect(() => updateDailyOrStreakZodSchema.parse(invalidData)).toThrow(z.ZodError);
    });
  });

  describe('createCharacterZodSchema', () => {
    it('should validate a correct character creation', () => {
      const validData = [
        {
          _id: 1,
          name: 'Jon Snow',
          gender: 'Male',
          born: 'In 283 AC',
          origin: 'Winterfell',
          death: 'In 305 AC',
          status: 'Deceased',
          culture: 'Northmen',
          religion: 'Old Gods of the Forest',
          titles: ['Lord Commander of the Night\'s Watch'],
          house: 'Stark',
          father: 'Rhaegar Targaryen',
          mother: 'Lyanna Stark',
          spouse: [],
          children: [],
          siblings: ['Sansa Stark', 'Arya Stark', 'Bran Stark', 'Rickon Stark'],
          lovers: ['Ygritte'],
          seasons: [1, 2, 3, 4, 5, 6, 7, 8],
          actor: 'Kit Harington',
        },
      ];

      expect(() => createCharacterZodSchema.parse(validData)).not.toThrow();
    });

    it('should fail validation for incorrect character creation', () => {
      const invalidData = [
        {
          _id: -1,
          name: 'jon Peter Snow',
          gender: 'Male',
          born: 'In 283 AC',
          origin: 'Winterfell',
          death: 'In 305 AC',
          status: 'Deceased',
          culture: 'Northmen',
          religion: 'Old Gods of the Forest',
          titles: ['Lord Commander of the Night\'s Watch'],
          house: 'Stark',
          father: 'Rhaegar Targaryen',
          mother: 'Lyanna Stark',
          spouse: [],
          children: [],
          siblings: ['Sansa Stark', 'Arya Stark', 'Bran Stark', 'Rickon Stark'],
          lovers: ['Ygritte'],
          seasons: [1, 2, 3, 4, 5, 6, 7, 9],
          actor: 'Kit Harington',
        },
      ];

      expect(() => createCharacterZodSchema.parse(invalidData)).toThrow(z.ZodError);
    });
    it('should fail validation for incorrect character creation', () => {
      const invalidData = [
        {
          _id: 1,
          name: '',
          gender: 'Male',
          born: 'In 283 AC',
          origin: 'Winterfell',
          death: 'In 305 AC',
          status: 'Deceased',
          culture: 'Northmen',
          religion: 'Old Gods of the Forest',
          titles: ['Lord Commander of the Night\'s Watch'],
          house: 'Stark',
          father: 'Rhaegar Targaryen',
          mother: 'Lyanna Stark',
          spouse: [],
          children: [],
          siblings: ['Sansa Stark', 'Arya Stark', 'Bran Stark', 'Rickon Stark'],
          lovers: ['Ygritte'],
          seasons: [1, 2, 3, 4, 5, 6, 7, 9],
          actor: 'Kit Harington',
        },
      ];

      expect(() => createCharacterZodSchema.parse(invalidData)).toThrow(z.ZodError);
    });
  });
});