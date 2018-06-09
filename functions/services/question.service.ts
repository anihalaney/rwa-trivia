const questionFireBaseClient = require('../db/firebase-client');
const questionFireStoreClient = questionFireBaseClient.firestore();


/**
 * getAllQuestions
 * return questions
 */
exports.getAllQuestions = (): Promise<any> => {
    return questionFireStoreClient.collection('questions')
        .get()
        .then(questions => { return questions });
};


/**
 * getQuestionById
 * return question
 */
exports.getQuestionById = (questionId): Promise<any> => {
    return questionFireStoreClient.doc(`/questions/${questionId}`)
        .get()
        .then((qs) => { return qs });
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

