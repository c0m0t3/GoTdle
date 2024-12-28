import request from 'supertest';
import express, { NextFunction } from 'express';
import { Routes } from '../src/routes/routes';
import { AuthController } from '../src/controller/auth.controller';
import { UserController } from '../src/controller/user.controller';
import { ScoreController } from '../src/controller/score.controller';
import { CharacterController } from '../src/controller/character.controller';

jest.mock('../src/middleware/auth.middleware', () => ({
  verifyAccess: (_req: Request, _res: Response, next: NextFunction) => {
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
  let characterController: CharacterController;

  beforeAll(() => {
    authController = {
      loginUser: jest.fn((_req, res) =>
        res.status(200).json({ token: 'test-token' }),
      ),
      registerUser: jest.fn((_req, res) =>
        res.status(201).json({ id: TEST_IDS.USER_ID }),
      ),
    } as unknown as AuthController;

    userController = {
      getUserById: jest.fn((_req, res) =>
        res.status(200).json({ id: TEST_IDS.USER_ID }),
      ),
      getUserByUsername: jest.fn((_req, res) =>
        res.status(200).json({ id: TEST_IDS.USER_ID }),
      ),
      getUserByEmail: jest.fn((_req, res) =>
        res.status(200).json({ id: TEST_IDS.USER_ID }),
      ),
      updateUser: jest.fn((_req, res) =>
        res.status(200).json({ id: TEST_IDS.USER_ID }),
      ),
      deleteUser: jest.fn((_req, res) =>
        res.status(200).json({ id: TEST_IDS.USER_ID }),
      ),
      getAllUsers: jest.fn((_req, res) =>
        res.status(200).json([{ id: TEST_IDS.USER_ID }]),
      ),
    } as unknown as UserController;

    scoreController = {
      getScoreByUserId: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
      updateScoreByUserId: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
    } as unknown as ScoreController;

    characterController = {
      getCharacterById: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
      getCharacters: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
      createCharacter: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
      deleteAllCharacters: jest.fn((_req, res) => res.status(204).json({})),
    } as unknown as CharacterController;

    const routes = new Routes(
      authController,
      userController,
      scoreController,
      characterController,
    );
    app = express();
    app.use(express.json());
    app.use(routes.getRouter());
  }, 50000);

  it('should call getUserById', async () => {
    await request(app).get(`/users/${TEST_IDS.USER_ID}`).expect(200);
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
    await request(app)
      .put(`/users/${TEST_IDS.USER_ID}`)
      .send({ email: 'updated@example.com' })
      .expect(200);
    expect(userController.updateUser).toHaveBeenCalled();
  }, 10000);

  it('should call deleteUser', async () => {
    await request(app).delete(`/users/${TEST_IDS.USER_ID}`).expect(200);
    expect(userController.deleteUser).toHaveBeenCalled();
  }, 10000);

  it('should call getScoreByUserId', async () => {
    await request(app).get(`/scores/${TEST_IDS.USER_ID}`).expect(200);
    expect(scoreController.getScoreByUserId).toHaveBeenCalled();
  }, 10000);

  it('should call updateScoreByUserId', async () => {
    await request(app)
      .put(`/scores/${TEST_IDS.USER_ID}`)
      .send({ streak: 5 })
      .expect(200);
    expect(scoreController.updateScoreByUserId).toHaveBeenCalled();
  }, 10000);
});
