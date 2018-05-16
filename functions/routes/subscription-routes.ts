
express = require('express'),
    router = express.Router();

const subscriptionController = require('../controllers/subscription.controller');

router.get('/count', subscriptionController.getSubscriptionCount);


module.exports = router;
