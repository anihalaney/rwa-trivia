import * as express from 'express';
import { FriendController } from '../controllers/friend.controller';
import { AuthMiddleware } from '../middlewares/auth';

class FriendRoutes {

    public friendRoutes: any;

    constructor() {
        this.friendRoutes = express.Router();

        this.friendRoutes.post('/', FriendController.createFriends);
        this.friendRoutes.post('/invitation', AuthMiddleware.authorizedOnly, FriendController.createInvitations);
    }
}

export default new FriendRoutes().friendRoutes;




