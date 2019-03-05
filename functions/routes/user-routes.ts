
import * as express from 'express';
import { UserController } from '../controllers/user.controller';
import { AuthMiddleware} from "../middlewares/auth";
export const userRoutes = express.Router();

userRoutes.get('/:userId', UserController.getUserById);
userRoutes.get('/profile/:userId/:imageName/:width/:height', UserController.getUserImages);
userRoutes.post('/profile', AuthMiddleware.authorizedOnly, UserController.generateUserProfileImage);
userRoutes.post('/update-lives', AuthMiddleware.authorizedOnly, UserController.updateLives);


