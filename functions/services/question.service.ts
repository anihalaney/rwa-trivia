import admin from '../db/firebase.client';

export class QuestionService {

    private static fireStoreClient = admin.firestore();

    /**
     * getAllQuestions
     * return questions
     */
    static async getAllQuestions(): Promise<any> {
        try {
            return await this.fireStoreClient.collection('questions').get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * getQuestionById
     * return question
     */
    static async getQuestionById(questionId): Promise<any> {
        try {
            return await this.fireStoreClient.doc(`/questions/${questionId}`).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * getAllUnpublishedQuestions
     * return questions
     */
    static async getQuestion(collectionName): Promise<any> {
        try {
            return await this.fireStoreClient.collection(`${collectionName}`).get();
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    /**
     * setQuestion
     * return ref
     */
    static async updateQuestion(collectionName: string, question: any): Promise<any> {
        try {
            return await this.fireStoreClient.doc(`/${collectionName}/${question.id}`).set(question);
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }
}
