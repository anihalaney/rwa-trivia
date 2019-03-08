import * as express from 'express';
import { FriendController } from '../controllers/friend.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class FriendRoutes {

    public friendRoutes: any;

    constructor() {

        this.friendRoutes = express.Router();

        //  '/'
        this.friendRoutes.post('/', FriendController.createFriends);

        //  '/invitation'
        this.friendRoutes.post(`/${RoutesConstants.INVITATION}`,
            AuthMiddleware.authorizedOnly, FriendController.createInvitations);

    }
}

export default new FriendRoutes().friendRoutes;
