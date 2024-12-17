import request from 'supertest';
import express, { NextFunction } from 'express';
import { Routes } from '../src/routes/routes';
import { AuthController } from '../src/controller/auth.controller';
import { UserController } from '../src/controller/user.controller';
import { ScoreController } from '../src/controller/score.controller';
import { verifyAccess } from '../src/middleware/auth.middleware';

jest.mock('../src/middleware/auth.middleware', () => ({
  verifyAccess: (req: Request, res: Response, next: NextFunction) => {
    next();
  },
}));

const TEST_IDS = {
  USER_ID: '123e4567-e89b-12d3-a456-426614174000',
} as const;

describe('Routes', () => {
  let app: express.Application;
  let authController: AuthController;
  let userController: UserController;
  let scoreController: ScoreController;

  beforeAll(() => {
    authController = {
      // Mock methods
      loginUser: jest.fn((req, res) => res.status(200).json({ token: 'test-token' })),
      registerUser: jest.fn((req, res) => res.status(201).json({ id: TEST_IDS.USER_ID })),
    } as any;

    userController = {
      // Mock methods
      getUserById: jest.fn((req, res) => res.status(200).json({ id: TEST_IDS.USER_ID })),
      getUserByUsername: jest.fn((req, res) => res.status(200).json({ id: TEST_IDS.USER_ID })),
      getUserByEmail: jest.fn((req, res) => res.status(200).json({ id: TEST_IDS.USER_ID })),
      updateUser: jest.fn((req, res) => res.status(200).json({ id: TEST_IDS.USER_ID })),
      deleteUser: jest.fn((req, res) => res.status(200).json({ id: TEST_IDS.USER_ID })),
      getAllUsers: jest.fn((req, res) => res.status(200).json([{ id: TEST_IDS.USER_ID }])),
    } as any;

    scoreController = {
      // Mock methods
      getScoreByUserId: jest.fn((req, res) => res.status(200).json({ userId: TEST_IDS.USER_ID })),
      updateScoreByUserId: jest.fn((req, res) => res.status(200).json({ userId: TEST_IDS.USER_ID })),
    } as any;

    const routes = new Routes(authController, userController, scoreController);
    app = express();
    app.use(express.json());
    app.use(routes.getRouter());
  }, 50000);

  it('should call getUserById', async () => {
    await request(app).get('/users/123e4567-e89b-12d3-a456-426614174000').expect(200);
    expect(userController.getUserById).toHaveBeenCalled();
  }, 10000);

  it('should call getUserByUsername', async () => {
    await request(app).get('/users/username/testuser').expect(200);
    expect(userController.getUserByUsername).toHaveBeenCalled();
  }, 10000);

  it('should call getUserByEmail', async () => {
    await request(app).get('/users/email/test@example.com').expect(200);
    expect(userController.getUserByEmail).toHaveBeenCalled();
  }, 10000);

  it('should call updateUser', async () => {
    await request(app).put('/users/123e4567-e89b-12d3-a456-426614174000').send({ email: 'updated@example.com' }).expect(200);
    expect(userController.updateUser).toHaveBeenCalled();
  }, 10000);

  it('should call deleteUser', async () => {
    await request(app).delete('/users/123e4567-e89b-12d3-a456-426614174000').expect(200);
    expect(userController.deleteUser).toHaveBeenCalled();
  }, 10000);

  it('should call getScoreByUserId', async () => {
    await request(app).get('/scores/123e4567-e89b-12d3-a456-426614174000').expect(200);
    expect(scoreController.getScoreByUserId).toHaveBeenCalled();
  }, 10000);

  it('should call updateScoreByUserId', async () => {
    await request(app).put('/scores/123e4567-e89b-12d3-a456-426614174000').send({ streak: 5 }).expect(200);
    expect(scoreController.updateScoreByUserId).toHaveBeenCalled();
  }, 10000);
});