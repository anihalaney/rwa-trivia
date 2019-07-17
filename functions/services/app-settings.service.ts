import { ApplicationSettings, CollectionConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class AppSettings {

    private static _instance: AppSettings;
    private static applicationSettingsFirestoreClient: any = admin.firestore();
    public appSettings: ApplicationSettings;

    constructor() {
        admin.firestore().doc(CollectionConstants.APPLICATION_SETTINGS_FORWARD_SLASH_SETTINGS)
            .onSnapshot((querySnapshot) => {
                this.appSettings = querySnapshot.data();
            });
    }

    public static get Instance() {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }

    async loadAppSettings(): Promise<any> {
        try {
            const response = await admin.firestore().doc(CollectionConstants.APPLICATION_SETTINGS_FORWARD_SLASH_SETTINGS).get();
            this.appSettings = response.data();
            return this.appSettings;
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    async getAppSettings(): Promise<ApplicationSettings> {
        if (this.appSettings) {
            return await this.appSettings;
        } else {
            return this.loadAppSettings();
        }
    }

    async updateUserDisplayNameValue(value: number) {
        try {
            const userRef = AppSettings.applicationSettingsFirestoreClient.collection('application_settings').doc('settings');
            const docRef = await userRef.get();
            if (docRef.exists) {
                userRef.set({ user_display_name_value: value }, { merge: true });
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    async updateAppVersion(versionCode: number, platform: string) {
        try {
            const userRef = AppSettings.applicationSettingsFirestoreClient.collection('application_settings').doc('settings');
            const docRef = await userRef.get();

            if (docRef.exists) {
                const updateVersion = platform === 'android' ? { android_version: versionCode } : { ios_version: versionCode };
                userRef.set(updateVersion, { merge: true });
            }
        } catch (error) {
            return Utils.throwError(error);
        }
    }
}


