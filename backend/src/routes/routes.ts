import { Router } from 'express';

//import { ...Controller } from '../controller/....controller';
//import { verifyAccess } from '../middleware/auth.middleware';

export class Routes {
  private router: Router;

  constructor(/*private readonly authController: AuthController,*/) {
    this.router = Router();
    this.initializeRoutes();
  }

  public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
    /*
    // Auth routes
    this.router.post(
      '/auth/register',
      this.authController.registerUser.bind(this.authController),
    );
    this.router.post(
      '/auth/login',
      this.authController.loginUser.bind(this.authController),
    );
    */
    /* Example using verifyAccess middleware
    this.router.use('/tags', verifyAccess);
    this.router.get(
      '/tags',
      this.tagController.getTags.bind(this.tagController),
    );*/
  }
}
