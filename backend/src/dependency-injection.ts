import { App } from './app';
import { ENV } from './config/env.config';
//import { AuthController } from './controller/auth.controller';
import { Database, db } from './database';
//import { UserRepository } from './database/repository/user.repository';
import { Routes } from './routes/routes';
import { Server } from './server';
//import { Jwt } from './utils/jwt';
//import { PasswordHasher } from './utils/password-hasher';

export const DI = {} as {
  app: App;
  db: Database;
  server: Server;
  routes: Routes;
  /*repositories: {
    user: UserRepository;
  };*/
  /*controllers: {
    auth: AuthController;
  };*/
  /*utils: {
    passwordHasher: PasswordHasher;
    jwt: Jwt;
  };*/
};

export function initializeDependencyInjection() {
  // Initialize database
  DI.db = db;

  // Initialize utils
  /*
  DI.utils = {
    passwordHasher: new PasswordHasher(10),
    jwt: new Jwt(ENV.JWT_SECRET, {
      expiresIn: 3600, // in seconds
      issuer: 'http://fwe.auth',
    }),
  };*/

  // Initialize repositories
  /*
  DI.repositories = {
    user: new UserRepository(DI.db),
  };*/

  // Initialize controllers
  /*
  DI.controllers = {
    auth: new AuthController(
      DI.repositories.user,
      DI.utils.passwordHasher,
      DI.utils.jwt,
    ),
  };*/

  // Initialize routes

  DI.routes = new Routes(/*DI.controllers.auth,*/);

  // Initialize app
  DI.app = new App(DI.routes);
  DI.server = new Server(DI.app, ENV);
}
