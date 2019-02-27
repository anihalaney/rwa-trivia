
import * as express from 'express';
const router = express.Router();
const userAuth = require('../middlewares/auth');


const userController = require('../controllers/user.controller');

router.get('/:userId', userController.getUserById);
router.get('/profile/:userId/:imageName/:width/:height', userController.getUserImages);
router.post('/profile', userAuth.authorizedOnly, userController.generateUserProfileImage);
router.post('/update-lives', userAuth.authorizedOnly, userController.updateLives);

module.exports = router;
