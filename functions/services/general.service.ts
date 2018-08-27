const generalFireBaseClient = require('../db/firebase-client');
const generalFireStoreClient = generalFireBaseClient.firestore();
const functions = require('firebase-functions');
import { ESUtils } from '../utils/ESUtils';
import { Question } from '../../projects/shared-library/src/lib/shared/model';

/**
 * migrateCollection
 * return status
 */
exports.migrateCollection = (collectionName): Promise<any> => {
    const sourceDB = generalFireStoreClient;
    // set required dev configuration parameters for different deployment environments(firebase project) using following command
    // default project in firebase is development deployment
    // firebase -P production functions:config:set devconfig.param1=value
    // After setting config variable do not forget to deploy functions
    // to see set environments firebase -P production functions:config:get
    const targetAppConfig = functions.config().devconfig;
    const config = {
        'apiKey': targetAppConfig.apikey,
        'authDomain': targetAppConfig.authdomain,
        'databaseURL': targetAppConfig.databaseurl,
        'projectId': targetAppConfig.projectid,
        'storageBucket': targetAppConfig.storagebucket,
        'messagingSenderId': targetAppConfig.messagingsenderid
    }
    // console.log('targetAppConfig', targetAppConfig);
    const targetDB = generalFireBaseClient.initializeApp(config, 'targetApp').firestore();
    return sourceDB.collection(collectionName).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                //  console.log(doc.id, '=>', doc.data());
                targetDB.collection(collectionName).doc(doc.id).set(doc.data());
            });
            return 'migrated collection';
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
};

/**
 * rebuildQuestionIndex
 * return status
 */
exports.rebuildQuestionIndex = (): Promise<any> => {
    const questions = [];
    return generalFireStoreClient.collection('/questions').orderBy('id').get().then(qs => {
        // admin.database().ref("/questions/published").orderByKey().once("value").then(qs => {
        // console.log("Questions Count: " + qs.length);
        qs.forEach(q => {
            // console.log(q.key);
            console.log(q.data());

            const data = q.data();
            const question: { 'id': string, 'type': string, 'source': any } = {
                'id': data.id,
                'type': data.categoryIds['0'],
                'source': data
            };
            questions.push(question);
        });

        return ESUtils.rebuildIndex(ESUtils.QUESTIONS_INDEX, questions).then((response) => {
            return 'Questions indexed';
        })
            .catch((error) => {
                return error;
            })
    });
}

/**
 * getTestQuestion
 * return status
 */
exports.getTestQuestion = (): Promise<any> => {
    return generalFireBaseClient.database().ref('/questions/published').orderByKey().limitToLast(1).once('value').then(qs => {
        qs.forEach(q => {
            console.log(q.key);
            console.log(q.val());

            const question: Question = q.val();
            question.id = q.key;
            return question;
        });
    })
        .catch(error => {
            return 'Failed to get Q';
        });

}


/**
 * getGameQuestionTest
 * return status
 */
exports.getGameQuestionTest = (): Promise<any> => {
    return ESUtils.getRandomGameQuestion([2, 4, 5, 6], []).then((question) => {
        return question;
    });
}



/**
 * getGameQuestionTest
 * return status
 */
exports.testES = (res) => {
    const client = ESUtils.getElasticSearchClient();

    client.ping({
        requestTimeout: 10000,
    }, (error) => {
        if (error) {
            console.error('elasticsearch cluster is down!');
            res.send('elasticsearch cluster is down!');
        } else {
            console.log('All is well');
            res.send(`Hello. ES is up`);
        }
    });
}
