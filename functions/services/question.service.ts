import { CollectionConstants, GeneralConstants, Question } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class QuestionService {

    private static fireStoreClient = admin.firestore();
    private static FS = GeneralConstants.FORWARD_SLASH;
    private static QC = CollectionConstants.QUESTIONS;

    /**
     * getAllQuestions
     * return questions
     */
    static async getAllQuestions(): Promise<any> {
        try {
            return Utils.getValesFromFirebaseSnapshot(await this.fireStoreClient.collection(this.QC).get());
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
                .doc(`${this.FS}${this.QC}${this.FS}${questionId}`)
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
            return Utils.getValesFromFirebaseSnapshot(await this.fireStoreClient.collection(`${collectionName}`).get());
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
                .doc(`${this.FS}${collectionName}${this.FS}${question.id}`)
                .set(question);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
