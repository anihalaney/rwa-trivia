const statQuestionService = require('../services/question.service');
import { Question } from '../../projects/shared-library/src/lib/shared/model';

export class QuestionBifurcation {
    getQuestionList(collectionName) {
        const userObs: { [key: string]: any } = {};
        return statQuestionService.getQuestion(collectionName).then(questionData => {
            questionData.docs.map((question, index) => {

                const questionObj: Question = question.data();
                if (questionObj.bulkUploadId) {
                    questionObj['source'] = 'bulk-question';
                } else {
                    questionObj['source'] = 'question';
                }
                statQuestionService.updateQuestion(collectionName, questionObj).then(ref => {
                    return questionObj.id;
                });
            });
        })
    }
}
