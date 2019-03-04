

import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
const router = express.Router();

const questionAuth = require('../middlewares/auth');

router.get('/day/:nextQ', QuestionController.getQuestionOfDay);
router.get('/next/:gameId', questionAuth.authorizedOnly, QuestionController.getNextQuestion);
router.get('/game/:gameId', questionAuth.authorizedOnly, QuestionController.getQuestions);
router.post('/:start/:size', questionAuth.adminOnly, QuestionController.getQuestions);
router.post('/:questionId', questionAuth.authorizedOnly, QuestionController.getUpdatedQuestion);


module.exports = router;
