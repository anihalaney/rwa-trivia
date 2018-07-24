
express = require('express'),
    router = express.Router();



const userController = require('../controllers/user.controller');

router.get('/:userId', userController.getUserById);
router.get('/profile/:userId/:width/:height', userController.getUserImages);


module.exports = router;
