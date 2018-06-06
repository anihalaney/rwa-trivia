

express = require('express'),
    router = express.Router();

const questionAuth = require('../middlewares/auth');

const questionController = require('../controllers/question.controller');


router.get('/day/:nextQ', questionController.getQuestionOfDay);
router.get('/next/:gameId', questionAuth.authorizedOnly, questionController.getNextQuestion);
router.get('/game/:gameId', questionAuth.authorizedOnly, questionController.getQuestions);
router.post('/:start/:size', questionAuth.adminOnly, questionController.getQuestions);
router.post('/:questionId', questionAuth.authorizedOnly, questionController.getUpdatedQuestion);


module.exports = router;
