
import * as express from 'express';
import { appConstants } from '../../projects/shared-library/src/lib/shared/model';
import router from './routes';

class RootRouter {

    public rootRouter: any;

    constructor() {

        this.rootRouter = express.Router();

        //  '/app/v1'
        this.rootRouter.use(`/${appConstants.API_PREFIX}/${appConstants.API_VERSION}`, router);
    }
}

export default new RootRouter().rootRouter;
