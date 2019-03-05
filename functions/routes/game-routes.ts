
import * as express from 'express';
import { GameController } from '../controllers/game.controller';
const router = express.Router();

const gameAuth = require('../middlewares/auth');


router.post('/', gameAuth.authorizedOnly, GameController.createGame);
router.put('/:gameId', gameAuth.authorizedOnly, GameController.updateGame);
router.post('/game-over/scheduler', gameAuth.authTokenOnly, GameController.checkGameOver);
router.get('/update/all', gameAuth.adminOnly, GameController.updateAllGame);
router.post('/turn/scheduler', gameAuth.authTokenOnly, GameController.changeGameTurn);
router.get('/social/:userId/:socialId', GameController.createSocialContent);
router.get('/social-image/:userId/:socialId', GameController.createSocialImage);

module.exports = router;
