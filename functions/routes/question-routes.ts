

import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class QuestionRoutes {

    private FS = GeneralConstants.FORWARD_SLASH;
    private CL = GeneralConstants.COLON;

    public questionRoutes: any;

    constructor() {

        this.questionRoutes = express.Router();

        //  '/day/:nextQ'
        this.questionRoutes.get(`${this.FS}${RoutesConstants.DAY}${this.FS}${this.CL}${RoutesConstants.NEXT_Q}`,
            QuestionController.getQuestionOfDay);

        //  '/next/:gameId'
        this.questionRoutes.post(`${this.FS}${RoutesConstants.NEXT}${this.FS}${this.CL}${RoutesConstants.GAME_ID}`,
            AuthMiddleware.authorizedOnly, QuestionController.getNextQuestion);

        //  '/:start/:size'
        this.questionRoutes.post(`${this.FS}${this.CL}${RoutesConstants.START}${this.FS}${this.CL}${RoutesConstants.SIZE}`,
            AuthMiddleware.adminOnly, QuestionController.getQuestions);

        //  '/:questionId'
        this.questionRoutes.post(`${this.FS}${this.CL}${RoutesConstants.QUESTION_ID}`,
            AuthMiddleware.authorizedOnly, QuestionController.getUpdatedQuestion);

    }
}

export default new QuestionRoutes().questionRoutes;

