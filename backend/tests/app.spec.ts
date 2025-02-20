import request from 'supertest';
import { Application } from 'express';
import { initializeDependencyInjection, DI } from '../src/dependency-injection';

describe('App', () => {
  let app: Application;
  let server: any;

  beforeEach(() => {
    initializeDependencyInjection();
    app = DI.app['app'];
    server = app.listen(3000, () => {});
  });

  afterEach(async () => {
    if (server && server.close) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('should apply helmet middleware', async () => {
    const response = await request(app).get('/api/characters');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('should register routes', async () => {
    const response = await request(app).get('/api/characters');
    expect(response.status).not.toBe(404);
  });

  it('should handle a 404 error', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
  });
});