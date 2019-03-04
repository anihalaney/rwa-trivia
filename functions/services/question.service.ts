import admin from '../db/firebase.client';
const questionFireStoreClient = admin.firestore();


/**
 * getAllQuestions
 * return questions
 */

export class QuestionService {

    static fireStoreClient = admin.firestore();

    public static async getAllQuestions(): Promise<any> {
        try {
            return await questionFireStoreClient.collection('questions').get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


/**
 * getQuestionById
 * return question
 */
    public static async getQuestionById(questionId): Promise<any> {
        try {
            return await questionFireStoreClient.doc(`/questions/${questionId}`).get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

/**
 * getAllUnpublishedQuestions
 * return questions
 */
    public static async getQuestion(collectionName): Promise<any> {
        try {
            return await questionFireStoreClient.collection(`${collectionName}`).get();
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

/**
 * setQuestion
 * return ref
 */
    public static async updateQuestion (collectionName: string, question: any): Promise<any> {
        try {
            return await questionFireStoreClient.doc(`/${collectionName}/${question.id}`).set(question);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
