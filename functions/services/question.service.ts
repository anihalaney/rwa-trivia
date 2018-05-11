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

