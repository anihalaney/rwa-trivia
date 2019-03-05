import * as express from 'express';
import { FriendController } from '../controllers/friend.controller';
import { AuthMiddleware} from "../middlewares/auth";

export const friendRoutes = express.Router();
friendRoutes.post('/', FriendController.createFriends);
friendRoutes.post('/invitation', AuthMiddleware.authorizedOnly, FriendController.createInvitations);
