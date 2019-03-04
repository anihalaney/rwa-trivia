

import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
export const questionRoutes = express.Router();

const questionAuth = require('../middlewares/auth');

questionRoutes.get('/day/:nextQ', QuestionController.getQuestionOfDay);
questionRoutes.get('/next/:gameId', questionAuth.authorizedOnly, QuestionController.getNextQuestion);
questionRoutes.get('/game/:gameId', questionAuth.authorizedOnly, QuestionController.getQuestions);
questionRoutes.post('/:start/:size', questionAuth.adminOnly, QuestionController.getQuestions);
questionRoutes.post('/:questionId', questionAuth.authorizedOnly, QuestionController.getUpdatedQuestion);
