import admin from '../db/firebase.client';
const functions = require('firebase-functions');
import { ESUtils } from '../utils/ESUtils';
import { Question } from '../../projects/shared-library/src/lib/shared/model';


export class MigrationService {
    /**
     * migrateCollection
     * return status
     */
    private static generalFireStoreClient = admin.firestore();

    static async migrateCollection(collectionName): Promise<any> {

        try {

            const sourceDB = this.generalFireStoreClient;
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
            };
            // console.log('targetAppConfig', targetAppConfig);
            const targetDB = admin.initializeApp(config, 'targetApp').firestore();
            const snapshot = await sourceDB.collection(collectionName).get();
            for (const doc of snapshot) {
                targetDB.collection(collectionName).doc(doc.id).set(doc.data());
            }
            return 'migrated collection';
        } catch (error) {
            throw error;
        }
    }

    /**
     * rebuildQuestionIndex
     * return status
     */
    static async rebuildQuestionIndex(): Promise<any> {

        try {

            const questions = [];
            const qs = await this.generalFireStoreClient.collection('/questions').orderBy('id').get();
                // admin.database().ref("/questions/published").orderByKey().once("value").then(qs => {
                // console.log("Questions Count: " + qs.length);
                for (const q of qs) {
                    // console.log(q.key);
                    console.log(q.data());

                    const data = q.data();
                    const question: { 'id': string, 'type': string, 'source': any } = {
                        'id': data.id,
                        'type': data.categoryIds['0'],
                        'source': data
                    };
                    questions.push(question);
                }

                await ESUtils.rebuildIndex(ESUtils.QUESTIONS_INDEX, questions);
                return 'Questions indexed';
        } catch (error) {
                console.log(error);
                throw error;
        }
    }

}
