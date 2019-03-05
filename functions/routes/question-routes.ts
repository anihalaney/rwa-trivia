

import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { AuthMiddleware} from "../middlewares/auth";
export const questionRoutes = express.Router();

questionRoutes.get('/day/:nextQ', QuestionController.getQuestionOfDay);
questionRoutes.get('/next/:gameId', AuthMiddleware.authorizedOnly, QuestionController.getNextQuestion);
questionRoutes.get('/game/:gameId', AuthMiddleware.authorizedOnly, QuestionController.getQuestions);
questionRoutes.post('/:start/:size', AuthMiddleware.adminOnly, QuestionController.getQuestions);
questionRoutes.post('/:questionId', AuthMiddleware.authorizedOnly, QuestionController.getUpdatedQuestion);
