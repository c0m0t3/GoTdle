import { App } from './app';
import { ENV } from './config/env.config';
import { Database, db } from './database';
import { ScoreRepository } from './database/repository/score.repository';
import { UserRepository } from './database/repository/user.repository';
import { AuthController } from './controller/auth.controller';
import { ScoreController } from './controller/score.controller';
import { UserController } from './controller/user.controller';
import { Routes } from './routes/routes';
import { Server } from './server';
import { Jwt } from './utils/jwt';
import { PasswordHasher } from './utils/password-hasher';

export const DI = {} as {
  app: App;
  db: Database;
  server: Server;
  routes: Routes;
  repositories: {
    user: UserRepository;
    score: ScoreRepository;
  };
  controllers: {
    auth: AuthController;
    user: UserController;
    score: ScoreController;
  };
  utils: {
    passwordHasher: PasswordHasher;
    jwt: Jwt;
  };
};

export function initializeDependencyInjection() {
  // Initialize database
  DI.db = db;

  // Initialize utils
  DI.utils = {
    passwordHasher: new PasswordHasher(10),
    jwt: new Jwt(ENV.JWT_SECRET, {
      expiresIn: 3600, // in seconds
      issuer: 'http://fwe.auth',
    }),
  };

  // Initialize repositories
  DI.repositories = {
    user: new UserRepository(DI.db),
    score: new ScoreRepository(DI.db),
  };

  // Initialize controllers
  DI.controllers = {
    auth: new AuthController(
      DI.repositories.user,
      DI.utils.passwordHasher,
      DI.utils.jwt,
    ),
    user: new UserController(DI.repositories.user),
    score: new ScoreController(DI.repositories.score),
  };

  // Initialize routes
  DI.routes = new Routes(
    DI.controllers.auth,
    DI.controllers.user,
    DI.controllers.score,
  );

  // Initialize app
  DI.app = new App(DI.routes);
  DI.server = new Server(DI.app, ENV);
}
