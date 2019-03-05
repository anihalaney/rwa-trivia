import admin from '../db/firebase.client';
// const accountFireStoreClient = admin.firestore();
import { ApplicationSettings } from '../../projects/shared-library/src/lib/shared/model';
export class AppSettings {
    private appSettings: ApplicationSettings;

    constructor() {
        admin.firestore().doc('application_settings/settings')
            .onSnapshot((querySnapshot) => {
                this.appSettings = querySnapshot.data();
            });
    }

    async loadAppSetttings(): Promise<any> {
        try {
            const response = await admin.firestore().doc('application_settings/settings').get();
            this.appSettings = response.data();
            return this.appSettings;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAppSettings(): Promise<ApplicationSettings> {
        if (this.appSettings) {
            return await Promise.resolve(this.appSettings);
        } else {
            return this.loadAppSetttings();
        }
    }
}
