import { interceptorConstants, ResponseMessagesConstants, GeneralConstants } from '../../projects/shared-library/src/lib/shared/model';
import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export class Utils {

    static getUTCTimeStamp() {
        const date = new Date(new Date().toUTCString());
        const millis = date.getTime();
        return millis;
    }

    static addMinutes(time, minutes) {
        return time + minutes;
    }

    static getValesFromFirebaseSnapshot(snapshots: any): any[] {

        const values: any[] = [];

        for (const snapshot of snapshots.docs) {
            values.push(snapshot.data());
        }

        return values;
    }

    static throwError(error): Promise<any> {
        console.error(GeneralConstants.Error_Message, error);
        throw error;
    }

    static sendResponse(res: any, status: number, responseObj: any): void {
        return res.status(status).send(responseObj);
    }

    static sendError(res: any, error: any): void {
        console.error(GeneralConstants.Error_Message, error);
        Utils.sendResponse(res, interceptorConstants.INTERNAL_ERROR, ResponseMessagesConstants.INTERNAL_SERVER_ERROR);
    }

    static getFireStorageBucket(admin: any): any {
        return admin.storage().bucket(Utils.getConfig().storagebucket);
    }

    static isEnvironmentProduction(): boolean {
        return (functions.config().environment &&
            functions.config().environment.production &&
            functions.config().environment.production === GeneralConstants.TRUE) ? true : false;
    }

    static getESPrefix(): string {
        // set required prefix for different deployment environments(firebase project) using following command
        // default project in firebase is development deployment
        // firebase -P production functions:config:set environment.production=true
        // After setting config variable do not forget to deploy functions
        // to see set environments firebase -P production functions:config:get
        let prefix = 'dev:';
        if (Utils.isEnvironmentProduction()) {
            prefix = '';
        }
        return prefix;
    }

    static getWebsiteUrl(): string {
        let websiteUrl = `https://`;
        if (Utils.isEnvironmentProduction()) {
            websiteUrl += 'bitwiser.io';
        } else {
            websiteUrl += 'rwa-trivia-dev-e57fc.firebaseapp.com';
        }
        return websiteUrl;
    }

    static changeFieldValue(value): any {
        return firebase.firestore.FieldValue.increment(value);
    }

    static getConfig(): any {
        let config = {};
        try {
            config = JSON.parse(readFileSync(resolve(__dirname, `../../../configs/${process.env.GCLOUD_PROJECT}.json`), 'utf8'));
        } catch (e) {
            console.error('No config found for project');
        }
        return config;
    }

}
