import { ApplicationSettings, CollectionConstants } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';

export class AppSettings {

    private appSettings: ApplicationSettings;

    constructor() {
        admin.firestore().doc(CollectionConstants.APPLICATION_SETTINGS_FORWARD_SLASH_SETTINGS)
            .onSnapshot((querySnapshot) => {
                this.appSettings = querySnapshot.data();
            });
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
}
