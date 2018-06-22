
express = require('express'),
    router = express.Router();



const userController = require('../controllers/user.controller');

router.get('/:userId', userController.getUserById);


module.exports = router;
