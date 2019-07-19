

import * as express from 'express';
import { QuestionController } from '../controllers/question.controller';
import { AuthMiddleware } from '../middlewares/auth';
import { GeneralConstants, RoutesConstants } from '../../projects/shared-library/src/lib/shared/model';

class QuestionRoutes {

    public questionRoutes: any;

    constructor() {

        this.questionRoutes = express.Router();

        //  'uploadQuestionImage'
        this.questionRoutes.post(`/${RoutesConstants.UPLOAD_QUESTION_IMAGE}`,
            AuthMiddleware.authorizedOnly, QuestionController.uploadQuestionImage);

        //  '/day/:nextQ'
        this.questionRoutes.get(`/${RoutesConstants.DAY}/:${RoutesConstants.NEXT_Q}`,
            QuestionController.getQuestionOfDay);

        //  '/next/:gameId'
        this.questionRoutes.post(`/${RoutesConstants.NEXT}/:${RoutesConstants.GAME_ID}`,
            AuthMiddleware.authorizedOnly, QuestionController.getNextQuestion);


        //  'userReaction/:questionId'
        this.questionRoutes.post(`/:${RoutesConstants.USER_REACTION}/:${RoutesConstants.QUESTION_ID}`,
        AuthMiddleware.authorizedOnly, QuestionController.userReaction);

        //  '/:start/:size'
        this.questionRoutes.post(`/:${RoutesConstants.START}/:${RoutesConstants.SIZE}`,
            AuthMiddleware.adminOnly, QuestionController.getQuestions);

        //  '/:questionId'
        this.questionRoutes.post(`/:${RoutesConstants.QUESTION_ID}`,
            AuthMiddleware.authorizedOnly, QuestionController.getUpdatedQuestion);

        //  'getQuestionImage/:questionId'
        this.questionRoutes.get(`/:${RoutesConstants.GET_QUESTION_IMAGE}/:${RoutesConstants.IMAGE_NAME}`,
            QuestionController.getQuestionImage);

    }
}

export default new QuestionRoutes().questionRoutes;

