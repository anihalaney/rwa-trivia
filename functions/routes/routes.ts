
import { appConstants } from '../../projects/shared-library/src/lib/shared/model';
import * as express from 'express';
import { questionRoutes } from './question-routes';
import { subscriptionRoutes } from './subscription-routes';
import { generalRoutes } from './general-routes';
import { migrationRoutes } from './migration-routes';

const router = express.Router();
const gameRoutes = require('./game-routes');
const friendRoutes = require('./friend-routes');
const userRoutes = require('./user-routes');


router.use(`/${appConstants.API_PREFIX}/question`, questionRoutes);
router.use(`/${appConstants.API_PREFIX}/subscription`, subscriptionRoutes);
router.use(`/${appConstants.API_PREFIX}/game`, gameRoutes);
router.use(`/${appConstants.API_PREFIX}/general`, generalRoutes);
router.use(`/${appConstants.API_PREFIX}/migration`, migrationRoutes);
router.use(`/${appConstants.API_PREFIX}/friend`, friendRoutes);
router.use(`/${appConstants.API_PREFIX}/user`, userRoutes);



module.exports = router;
