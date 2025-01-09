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
      '/auth/register',
      this.authController.registerUser.bind(this.authController),
    );
    this.router.post(
      '/auth/login',
      this.authController.loginUser.bind(this.authController),
    );

    // User routes
    this.router.use('/users', verifyAccess);
    this.router.get(
      '/users',
      this.userController.getAllUsers.bind(this.userController),
    );
    this.router.get(
      '/users/me',
      this.userController.getUserById.bind(this.userController),
    );
    this.router.get(
      '/users/search',
      this.userController.getUsersByNameSearch.bind(this.userController),
    );
    this.router.get(
      '/users/username/:username',
      this.userController.getUserByUsername.bind(this.userController),
    );
    this.router.get(
      '/users/email/:email',
      this.userController.getUserByEmail.bind(this.userController),
    );
    this.router.put(
      '/users',
      this.userController.updateUser.bind(this.userController),
    );
    this.router.delete(
      '/users',
      this.userController.deleteUser.bind(this.userController),
    );

    // Score routes
    this.router.use('/scores', verifyAccess);
    this.router.get(
      '/scores/:userId',
      this.scoreController.getScoreByUserId.bind(this.scoreController),
    );
    this.router.put(
      '/scores',
      this.scoreController.updateScoreByUserId.bind(this.scoreController),
    );
    this.router.put(
      '/scores/daily',
      this.scoreController.updateDailyScoreByUserId.bind(this.scoreController),
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
