import { CollectionConstants, GeneralConstants, Question } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class QuestionService {

    private static fireStoreClient = admin.firestore();

    /**
     * getAllQuestions
     * return questions
     */
    static async getAllQuestions(): Promise<any> {
        try {
            return Utils.getObjectValues(await this.fireStoreClient.collection(CollectionConstants.QUESTIONS).get());
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
            const questionResult = await this.fireStoreClient
                .doc(`${GeneralConstants.FORWARD_SLASH}${CollectionConstants.QUESTIONS}${GeneralConstants.FORWARD_SLASH}${questionId}`)
                .get();
            return Question.getViewModelFromDb(questionResult.data());
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
            return Utils.getObjectValues(await this.fireStoreClient.collection(`${collectionName}`).get());
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
            return await this.fireStoreClient
                .doc(`${GeneralConstants.FORWARD_SLASH}${collectionName}${GeneralConstants.FORWARD_SLASH}${question.id}`)
                .set(question);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
