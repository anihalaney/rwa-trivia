
import * as express from 'express';
import { UserController } from '../controllers/user.controller';
const router = express.Router();
const userAuth = require('../middlewares/auth');


router.get('/:userId', UserController.getUserById);
router.get('/profile/:userId/:imageName/:width/:height', UserController.getUserImages);
router.post('/profile', userAuth.authorizedOnly, UserController.generateUserProfileImage);
router.post('/update-lives', userAuth.authorizedOnly, UserController.updateLives);

module.exports = router;
