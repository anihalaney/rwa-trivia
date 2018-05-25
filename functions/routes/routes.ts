
let express = require('express'),
    router = express.Router();

const questionRoutes = require('./question-routes');
const gameRoutes = require('./game-routes');
const subscriptionRoutes = require('./subscription-routes');
const generalRoutes = require('./general-routes');
const friendRoutes = require('./friend-routes');
const userRoutes = require('./user-routes');


router.use('/question', questionRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/game', gameRoutes);
router.use('/general', generalRoutes);
router.use('/friend', friendRoutes);
router.use('/user', userRoutes);


module.exports = router;
