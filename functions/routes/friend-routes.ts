import * as express from 'express';
const router = express.Router();


const friendController = require('../controllers/friend.controller');
const friendAuth = require('../middlewares/auth');

router.post('/', friendController.createFriends);
router.post('/invitation', friendAuth.authorizedOnly, friendController.createInvitations);


module.exports = router;
