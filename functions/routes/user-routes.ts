
import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware } from '../middlewares/auth';

class UserRoutes {

    public userRoutes: any;

    constructor() {
        this.userRoutes = express.Router();

        this.userRoutes.get('/:userId', UserController.getUserById);
        this.userRoutes.get('/profile/:userId/:imageName/:width/:height', UserController.getUserImages);
        this.userRoutes.post('/profile', AuthMiddleware.authorizedOnly, UserController.generateUserProfileImage);
        this.userRoutes.post('/update-lives', AuthMiddleware.authorizedOnly, UserController.updateLives);
    }
}

export default new UserRoutes().userRoutes;

