import admin from '../db/firebase.client';
const functions = require('firebase-functions');
import { ESUtils } from '../utils/ESUtils';
import { Question } from '../../projects/shared-library/src/lib/shared/model';


export class GeneralService {

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
