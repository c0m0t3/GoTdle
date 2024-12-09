import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { UserController } from '../controller/user.controller';
import { ScoreController } from '../controller/score.controller';
import { verifyAccess } from '../middleware/auth.middleware';

export class Routes {
  private router: Router;

  constructor(
    private readonly authController: AuthController,
    private readonly userController: UserController,
    private readonly scoreController: ScoreController,
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
    // Auth routes
    this.router.post(
      '/users',
      this.authController.registerUser.bind(this.authController),
    );
    this.router.post(
      '/users/login',
      this.authController.loginUser.bind(this.authController),
    );

    // User routes
    this.router.get(
      '/users',
      verifyAccess,
      this.userController.getAllUsers.bind(this.userController),
    );
    this.router.get(
      '/users/:id',
      verifyAccess,
      this.userController.getUserById.bind(this.userController),
    );
    this.router.get(
      '/users/username/:username',
      verifyAccess,
      this.userController.getUserByUsername.bind(this.userController),
    );
    this.router.get(
      '/users/email/:email',
      verifyAccess,
      this.userController.getUserByEmail.bind(this.userController),
    );
    this.router.put(
      '/users/:id',
      verifyAccess,
      this.userController.updateUser.bind(this.userController),
    );
    this.router.delete(
      '/users/:id',
      verifyAccess,
      this.userController.deleteUser.bind(this.userController),
    );

    // Score routes
    this.router.post(
      '/scores',
      verifyAccess,
      this.scoreController.createScore.bind(this.scoreController),
    );
    this.router.get(
      '/scores/:userId',
      verifyAccess,
      this.scoreController.getScoreByUserId.bind(this.scoreController),
    );
    this.router.put(
      '/scores/:userId',
      verifyAccess,
      this.scoreController.updateScoreByUserId.bind(this.scoreController),
    );
    this.router.delete(
      '/scores/:id',
      verifyAccess,
      this.scoreController.deleteScore.bind(this.scoreController),
    );
  }
}