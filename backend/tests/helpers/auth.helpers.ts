import request from 'supertest';
import { App } from '../../src/app';

export const createTestUserAndGetToken = async (app: App): Promise<string> => {
  await request(app.getServer())
    .post('/api/auth/register')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
      username: 'Test',
    });

  const response = await request(app.getServer())
    .post('/api/auth/login')
    .send({
      email: 'testuser@example.com',
      password: 'password123',
    });

  return response.body.accessToken;
};