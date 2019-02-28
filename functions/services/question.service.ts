import admin from '../db/firebase.client';
const questionFireStoreClient = admin.firestore();


/**
 * getAllQuestions
 * return questions
 */
exports.getAllQuestions = async (): Promise<any> => {
    try {
        return await questionFireStoreClient.collection('questions').get();
    } catch (error) {
        console.error(error);
        throw error;
    }
};


/**
 * getQuestionById
 * return question
 */
exports.getQuestionById = async (questionId): Promise<any> => {
    try {
        return await questionFireStoreClient.doc(`/questions/${questionId}`).get();
    } catch (error) {
        console.error(error);
        throw error;
    }
};

/**
 * getAllUnpublishedQuestions
 * return questions
 */
exports.getQuestion = (collectionName): Promise<any> => {
    return questionFireStoreClient.collection(`${collectionName}`)
        .get().then(questions => { return questions })
        .catch(error => {
            console.error(error);
            return error;
        });
};

/**
 * setQuestion
 * return ref
 */
exports.updateQuestion = (collectionName: string, question: any): Promise<any> => {
    return questionFireStoreClient.doc(`/${collectionName}/${question.id}`).set(question).then(ref => { return ref })
        .catch(error => {
            console.error(error);
            return error;
        });
};

