import { Router } from 'express';
import { AuthController } from '../controller/auth.controller';
import { UserController } from '../controller/user.controller';
import { ScoreController } from '../controller/score.controller';
import { CharacterController } from '../controller/character.controller';
import { verifyAccess } from '../middleware/auth.middleware';

export class Routes {
  private router: Router;

  constructor(
    private readonly authController: AuthController,
    private readonly userController: UserController,
    private readonly scoreController: ScoreController,
    private readonly characterController: CharacterController,
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
      '/users',
      verifyAccess,
      this.userController.updateUser.bind(this.userController),
    );
    this.router.delete(
      '/users',
      verifyAccess,
      this.userController.deleteUser.bind(this.userController),
    );

    // Score routes
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

    // Character routes
    this.router.post(
      '/characters',
      this.characterController.createCharacter.bind(this.characterController),
    );
    this.router.get(
      '/characters',
      this.characterController.getCharacters.bind(this.characterController),
    );
    this.router.get(
      '/characters/:_id',
      this.characterController.getCharacterById.bind(this.characterController),
    );
    this.router.delete(
      '/characters',
      this.characterController.deleteAllCharacters.bind(
        this.characterController,
      ),
    );
  }
}
