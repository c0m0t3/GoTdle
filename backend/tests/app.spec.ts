import request from 'supertest';
import express, { Application } from 'express';
import helmet from 'helmet';
import { prepareAuthentication, verifyAccess } from '../src/middleware/auth.middleware';
import { globalErrorHandler } from '../src/utils/global-error';
import { initializeDependencyInjection, DI } from '../src/dependency-injection';

jest.mock('helmet', () => jest.fn(() => (req: express.Request, res: express.Response, next: express.NextFunction) => next()));
jest.mock('../src/middleware/auth.middleware', () => ({
  prepareAuthentication: jest.fn((req, res, next) => next()),
  verifyAccess: jest.fn((req, res, next) => next()),
}));
jest.mock('../src/utils/global-error', () => ({
  globalErrorHandler: jest.fn((err, req, res, next) => next()),
}));

describe('App', () => {
  let app: Application;
  let server: any;

  beforeEach(() => {
    initializeDependencyInjection();
    app = DI.app['app'];
    server = DI.app.listen(3000, () => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (server && server.close) {
      server.close();
    }
  });

  it('should register middlewares', () => {
    expect(helmet).toHaveBeenCalled();
    expect(prepareAuthentication).toHaveBeenCalled();
  });

  it('should register routes', () => {
    expect(DI.routes.getRouter).toBeInstanceOf(Function);
  });

  it('should register error handlers', () => {
    expect(globalErrorHandler).toHaveBeenCalled();
  });

  it('should handle a request', async () => {
    const response = await request(app).get('/api/characters');
    expect(response.status).not.toBe(404);
  });

  it('should handle a 404 error', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.status).toBe(404);
  });
});