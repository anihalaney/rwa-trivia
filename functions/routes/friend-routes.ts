import * as express from 'express';
export const friendRoutes = express.Router();
import { FriendController } from '../controllers/friend.controller';
const friendAuth = require('../middlewares/auth');

friendRoutes.post('/', FriendController.createFriends);
friendRoutes.post('/invitation', friendAuth.authorizedOnly, FriendController.createInvitations);
