import { Question, QuestionsConstants } from '../../projects/shared-library/src/lib/shared/model';
import { QuestionService } from '../services/question.service';
import { Utils } from './utils';

export class QuestionBifurcation {
    static async getQuestionList(collectionName) {
        try {
            const questions: Question[] = await QuestionService.getQuestion(collectionName);
            const promises = [];
            for (const questionObj of questions) {
                if (questionObj.bulkUploadId) {
                    questionObj[QuestionsConstants.SOURCE] = QuestionsConstants.BULK_QUESTION;
                } else {
                    questionObj[QuestionsConstants.SOURCE] = QuestionsConstants.QUESTION;
                }
                promises.push(QuestionService.updateQuestion(collectionName, questionObj));
            }
            return await Promise.all(promises);
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}
