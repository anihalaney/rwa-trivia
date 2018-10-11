import * as express from 'express';
const router = express.Router();


const friendController = require('../controllers/friend.controller');


router.post('/', friendController.createFriends);



module.exports = router;
