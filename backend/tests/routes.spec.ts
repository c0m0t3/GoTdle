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
      updateUser: jest.fn((_req, res) =>
        res.status(200).json({ id: TEST_IDS.USER_ID }),
      ),
      deleteUser: jest.fn((_req, res) =>
        res.status(200).json({ id: TEST_IDS.USER_ID }),
      ),
      getAllUsers: jest.fn((_req, res) =>
        res.status(200).json([{ id: TEST_IDS.USER_ID }]),
      ),
      getUsersByNameSearch: jest.fn((_req, res) =>
        res.status(200).json([{ id: TEST_IDS.USER_ID }]),
      ),
    } as unknown as UserController;

    scoreController = {
      updateScoreByUserId: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
      updateDailyScoreByUserId: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
      updateStreakByUserId: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
    } as unknown as ScoreController;

    characterController = {
      getCharacters: jest.fn((_req, res) =>
        res.status(200).json({ userId: TEST_IDS.USER_ID }),
      ),
      createCharacters: jest.fn((_req, res) =>
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
  }, 100000);

  //Auth Routes
  it('should call registerUser', async () => {
    await request(app).post('/auth/register').expect(201);
    expect(authController.registerUser).toHaveBeenCalled();
  }, 10000);

  it('should call loginUser', async () => {
    await request(app).post(`/auth/login`).expect(200);
    expect(authController.loginUser).toHaveBeenCalled();
  }, 10000);

  //User Routes
  it('should call getAllUsers', async () => {
    await request(app).get(`/users`).expect(200);
    expect(userController.getAllUsers).toHaveBeenCalled();
  }, 10000);

  it('should call getUserById', async () => {
    await request(app).get(`/users/me`).expect(200);
    expect(userController.getUserById).toHaveBeenCalled();
  }, 10000);

  it('should call updateUser', async () => {
    await request(app)
      .put(`/users`)
      .send({ email: 'updated@example.com' })
      .expect(200);
    expect(userController.updateUser).toHaveBeenCalled();
  }, 10000);

  it('should call deleteUser', async () => {
    await request(app).delete(`/users`).expect(200);
    expect(userController.deleteUser).toHaveBeenCalled();
  }, 10000);

  
  //Score Routes
  it('should call updateScoreByUserId', async () => {
    await request(app)
      .put(`/scores`)
      .send({ streak: 5 })
      .expect(200);
    expect(scoreController.updateScoreByUserId).toHaveBeenCalled();
  }, 10000);
  
  //ÜBERARBEITEN NEUE ANFORDERUNG
  it('should call updateDailyScoreByUserId', async () => {
    await request(app)
      .put(`/scores/daily`)
      .send({ dailyScore: [1, 2, 3] })
      .expect(200);
    expect(scoreController.updateDailyOrStreakByUserId).toHaveBeenCalled();
  }, 10000);


  //Character Routes
  it('should call getCharacters', async () => {
    await request(app).get(`/characters`).expect(200);
    expect(characterController.getCharacters).toHaveBeenCalled();
  }, 10000);

  it('should call createCharacters', async () => {
    await request(app).post(`/characters`).send([{ name: 'Jon Snow' }]).expect(200);
    expect(characterController.createCharacters).toHaveBeenCalled();
  }, 10000);

  it('should call deleteAllCharacters', async () => {
    await request(app).delete(`/characters`).expect(204);
    expect(characterController.deleteAllCharacters).toHaveBeenCalled();
  }, 10000);
});
