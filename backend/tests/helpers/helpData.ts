import { CreateUser } from '../../src/validation/validation';

export const TEST_CHARACTER = {
  _id: 1,
  name: 'Jon Snow',
};

export const TEST_CHARACTER2 = {
  _id: 2,
  name: 'Jon Snow',
};

export const TEST_CHARACTER_Full = {
  _id: 1,
  name: 'Jon Snow',
  gender: 'Male',
  born: 'In 283 AC',
  origin: 'Winterfell',
  death: 'N/A',
  status: 'Alive',
  culture: 'Northmen',
  religion: 'Old Gods of the Forest',
  titles: ["Lord Commander of the Night's Watch"],
  house: 'Stark',
  father: 'Rhaegar Targaryen',
  mother: 'Lyanna Stark',
  spouse: [],
  children: [],
  siblings: [
    'Robb Stark',
    'Sansa Stark',
    'Arya Stark',
    'Bran Stark',
    'Rickon Stark',
  ],
  lovers: ['Ygritte'],
  seasons: [1, 2, 3, 4, 5, 6, 7, 8],
  actor: 'Kit Harington',
};

export const TEST_USER = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'admin@example.com',
  password: 'password123',
  username: 'adminuser',
  createdAt: new Date(),
  isAdmin: true,
};

export const TEST_USER_NON_ADMIN = {
  id: '123e4567-e89b-12d3-a456-426614174001',
  email: 'user@example.com',
  password: 'password123',
  username: 'normaluser',
  createdAt: new Date(),
  isAdmin: false,
};

export interface Character {
  _id: number;
  name: string;
  gender: string | null;
  born: string | null;
  origin: string | null;
  death: string | null;
  status: string | null;
  culture: string | null;
  religion: string | null;
  titles: string[] | null;
  house: string | null;
  father: string | null;
  mother: string | null;
  spouse: string[] | null;
  children: string[] | null;
  siblings: string[] | null;
  lovers: string[] | null;
  seasons: number[] | null;
  actor: string | null;
}

export const TEST_SCORE = {
  userId: TEST_USER.id,
  streak: 0,
  lastPlayed: null,
  longestStreak: 0,
  recentScores: [[0, 0, 0]],
  dailyScore: [0, 0, 0],
};

export const TEST_USER_ID = {
  id: '123e4567-e89b-12d3-a456-426614174022',
};

export const TEST_USER_Schema: CreateUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
};

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date | null;
  isAdmin: boolean;
}

export const TEST_IDS = {
  NON_EXISTENT_USER: '123e4567-e89b-12d3-a456-426614174010',
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
  USER_ID2: '123e4567-e89b-12d3-a456-426614174001',
} as const;

export const userData = {
  email: 'test@example.com',
  password: 'password123',
  username: 'testuser',
  id: TEST_IDS.USER_ID,
  isAdmin: false,
};

export const userData2 = {
  email: 'test2@example.com',
  password: 'password123',
  username: 'testuser2',
  id: TEST_IDS.USER_ID2,
  isAdmin: false,
};
