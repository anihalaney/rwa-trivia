
import { appConstants } from '../../projects/shared-library/src/lib/shared/model';
import * as express from 'express';
import { questionRoutes } from './question-routes';
import { subscriptionRoutes } from './subscription-routes';
import { generalRoutes } from './general-routes';
import { migrationRoutes } from './migration-routes';
import { friendRoutes } from './friend-routes';
import { gameRoutes } from './game-routes';
import { userRoutes} from './user-routes';

export const router = express.Router();

router.use(`/${appConstants.API_PREFIX}/question`, questionRoutes);
router.use(`/${appConstants.API_PREFIX}/subscription`, subscriptionRoutes);
router.use(`/${appConstants.API_PREFIX}/game`, gameRoutes);
router.use(`/${appConstants.API_PREFIX}/general`, generalRoutes);
router.use(`/${appConstants.API_PREFIX}/migration`, migrationRoutes);
router.use(`/${appConstants.API_PREFIX}/scheduler`, migrationRoutes);
router.use(`/${appConstants.API_PREFIX}/friend`, friendRoutes);
router.use(`/${appConstants.API_PREFIX}/user`, userRoutes);

