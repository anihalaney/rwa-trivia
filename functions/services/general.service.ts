import admin from '../db/firebase.client';
import * as functions from 'firebase-functions';
import { ESUtils } from '../utils/ESUtils';
import { Question } from '../../projects/shared-library/src/lib/shared/model';


export class GeneralService {

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

                await ESUtils.rebuildIndex(questions);
                return 'Questions indexed';
        } catch (error) {
                console.log(error);
                throw error;
        }
    }

    /**
     * getTestQuestion
     * return status
     */
    static async getTestQuestion(): Promise<any> {

        try {
            const qs = await admin.database().ref('/questions/published').orderByKey().limitToLast(1).once('value');
            for (const q of qs) {
                console.log(q.key);
                console.log(q.val());

                const question: Question = q.val();
                question.id = q.key;
                return question;
            }
        } catch (error) {
            console.error(error);
            throw error;
        }


    }


    /**
     * getGameQuestionTest
     * return status
     */
    static async getGameQuestionTest(): Promise<any> {
        try {
            await ESUtils.getRandomGameQuestion([2, 4, 5, 6], []);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }



    /**
     * getGameQuestionTest
     * return status
     */
    static async testES(res): Promise<any> {
        try {

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

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
