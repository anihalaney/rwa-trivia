import { CollectionConstants, Question } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class QuestionService {

    private static fireStoreClient = admin.firestore();
    private static QC = CollectionConstants.QUESTIONS;

    /**
     * getAllQuestions
     * return questions
     */
    static async getAllQuestions(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(await QuestionService.fireStoreClient.collection(QuestionService.QC).get());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getQuestionById
     * return question
     */
    static async getQuestionById(questionId): Promise<any> {
        try {
            const questionResult = await QuestionService.fireStoreClient
                .doc(`/${QuestionService.QC}/${questionId}`)
                .get();
            let question = questionResult.data();
            if (question) {
                question['id'] = (question['id']) ? question['id'] : questionResult['id'];
            } else {
                question = new Question();
            }

            return Question.getViewModelFromDb(question);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getAllUnpublishedQuestions
     * return questions
     */
    static async getQuestion(collectionName): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(await QuestionService.fireStoreClient.collection(`${collectionName}`).get());
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setQuestion
     * return ref
     */
    static async updateQuestion(collectionName: string, question: any): Promise<any> {
        try {
            return await QuestionService.fireStoreClient
                .doc(`/${collectionName}/${question.id}`)
                .set(question, { merge: true });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
