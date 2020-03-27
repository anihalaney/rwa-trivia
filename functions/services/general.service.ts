import * as functions from 'firebase-functions';
import {
    CollectionConstants, GeneralConstants, Question, ResponseMessagesConstants, interceptorConstants
} from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { ESUtils } from '../utils/ESUtils';
import { Utils } from '../utils/utils';

export class GeneralService {

    private static generalFireStoreClient = admin.firestore();
    private static QC = CollectionConstants.QUESTIONS;
    static async migrateCollection(collectionName): Promise<any> {

        try {
            const sourceDB = GeneralService.generalFireStoreClient;
            // set required dev configuration parameters for different deployment environments(firebase project) using following command
            // default project in firebase is development deployment
            // firebase -P production functions:config:set devconfig.param1=value
            // After setting config variable do not forget to deploy functions
            // to see set environments firebase -P production functions:config:get
            const targetAppConfig = functions.config().devconfig;
            const config = {};

            config[GeneralConstants.API_KEY] = targetAppConfig.apikey;
            config[GeneralConstants.AUTH_DOMAIN] = targetAppConfig.authdomain;
            config[GeneralConstants.DATABASE_URL] = targetAppConfig.databaseurl;
            config[GeneralConstants.PROJECT_ID] = targetAppConfig.projectid;
            config[GeneralConstants.STORAGE_BUCKET] = targetAppConfig.storagebucket;
            config[GeneralConstants.MESSAGING_SENDER_ID] = targetAppConfig.messagingsenderid;


            const targetDB = admin.initializeApp(config, GeneralConstants.TARGET_APP).firestore();
            const snapshots = await sourceDB.collection(collectionName).get();
            for (const doc of snapshots.docs) {
                targetDB.collection(collectionName).doc(doc.id).set(doc.data());
            }
            return ResponseMessagesConstants.MIGRATED_COLLECTION;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * rebuildQuestionIndex
     * return status
     */
    static async rebuildQuestionIndex(): Promise<any> {

        try {
            const questions = [];
            const qs = await GeneralService.generalFireStoreClient
                .collection(`/${GeneralService.QC}`)
                .orderBy(GeneralConstants.ID)
                .get();
            for (const q of qs.docs) {
                const data = q.data();
                const question = {};

                question[GeneralConstants.ID] = data.id;
                question[GeneralConstants.TYPE] = data.categoryIds['0'];
                question[GeneralConstants.SOURCE] = data;
                questions.push(question);
            }
            await ESUtils.rebuildIndex(questions);
            return ResponseMessagesConstants.QUESTIONS_INDEXED;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getTestQuestion
     * return status
     */
    static async getTestQuestion(): Promise<any> {
        try {
            const qs = await admin.database()
                .ref(`/${GeneralService.QC}/${CollectionConstants.PUBLISHED}`)
                .orderByKey().limitToLast(1).once(GeneralConstants.VALUE);

            qs.forEach((q) => {
                const question: Question = q.val();
                question.id = q.key;
                return question;
            });

        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * getGameQuestionTest
     * return status
     */
    static async getGameQuestionTest(): Promise<any> {
        try {
            return await ESUtils.getRandomGameQuestion([2, 4, 5, 6], [], []);
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * testES
     * return status
     */
    static async testES(res): Promise<any> {
        try {
            const client = ESUtils.getElasticSearchClient();
            client.ping({
                requestTimeout: 10000,
            }, (error) => {
                if (error) {
                    Utils.sendResponse(res, interceptorConstants.INTERNAL_ERROR, ResponseMessagesConstants.ELASTIC_SEARCH_CLUSTER_IS_DOWN);
                } else {
                    Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.HELLO_ES_IS_UP);
                }
            });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
