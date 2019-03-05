import { Question } from '../../projects/shared-library/src/lib/shared/model';
import { QuestionService } from '../services/question.service';

export class QuestionBifurcation {
    async getQuestionList(collectionName) {
        try {
            const userObs: { [key: string]: any } = {};
            const questionData = await QuestionService.getQuestion(collectionName);
            for (const question of questionData.docs) {
                const questionObj: Question = question.data();
                if (questionObj.bulkUploadId) {
                    questionObj['source'] = 'bulk-question';
                } else {
                    questionObj['source'] = 'question';
                }
                const ref = await QuestionService.updateQuestion(collectionName, questionObj);

                if (ref) {
                    return questionObj.id;
                } else {
                    return;
                }
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
