import { ApplicationSettings } from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';

export class AppSettings {
    private appSettings: ApplicationSettings;

    constructor() {
        admin.firestore().doc('application_settings/settings')
            .onSnapshot((querySnapshot) => {
                this.appSettings = querySnapshot.data();
            });
    }

    async loadAppSettings(): Promise<any> {
        try {
            const response = await admin.firestore().doc('application_settings/settings').get();
            this.appSettings = response.data();
            return this.appSettings;
        } catch (error) {
            console.error('Error : ', error);
            throw error;
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
