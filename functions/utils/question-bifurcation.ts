import { Question } from '../../projects/shared-library/src/lib/shared/model';
import { QuestionService } from '../services/question.service';

export class QuestionBifurcation {
    getQuestionList(collectionName) {
        const userObs: { [key: string]: any } = {};
        return QuestionService.getQuestion(collectionName).then(questionData => {
            questionData.docs.map((question, index) => {

                const questionObj: Question = question.data();
                if (questionObj.bulkUploadId) {
                    questionObj['source'] = 'bulk-question';
                } else {
                    questionObj['source'] = 'question';
                }
                QuestionService.updateQuestion(collectionName, questionObj).then(ref => {
                    return questionObj.id;
                });
            });
        })
    }
}
