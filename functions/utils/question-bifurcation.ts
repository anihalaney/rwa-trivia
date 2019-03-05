import { Question } from '../../projects/shared-library/src/lib/shared/model';
import { QuestionService } from '../services/question.service';

export class QuestionBifurcation {
    static async getQuestionList(collectionName) {
        try {
            const questionData = await QuestionService.getQuestion(collectionName);
            const promises = [];
            for (const question of questionData.docs) {
                const questionObj: Question = question.data();
                if (questionObj.bulkUploadId) {
                    questionObj['source'] = 'bulk-question';
                } else {
                    questionObj['source'] = 'question';
                }
                promises.push(QuestionService.updateQuestion(collectionName, questionObj));
            }
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }
}
