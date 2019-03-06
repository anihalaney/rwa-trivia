

import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { AuthMiddleware } from '../middlewares/auth';

class QuestionRoutes {

    public questionRoutes: any;

    constructor() {
        this.questionRoutes = express.Router();

        this.questionRoutes.get('/day/:nextQ', QuestionController.getQuestionOfDay);
        this.questionRoutes.post('/next/:gameId', AuthMiddleware.authorizedOnly, QuestionController.getNextQuestion);
        this.questionRoutes.get('/game/:gameId', AuthMiddleware.authorizedOnly, QuestionController.getQuestions);
        this.questionRoutes.post('/:start/:size', AuthMiddleware.adminOnly, QuestionController.getQuestions);
        this.questionRoutes.post('/:questionId', AuthMiddleware.authorizedOnly, QuestionController.getUpdatedQuestion);
    }
}

export default new QuestionRoutes().questionRoutes;

