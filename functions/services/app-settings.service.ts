import admin from '../db/firebase.client';
// const accountFireStoreClient = admin.firestore();
import { ApplicationSettings } from '../../projects/shared-library/src/lib/shared/model';
export class AppSettings {
    appSettings: ApplicationSettings;

    constructor() {
        admin.firestore().doc('application_settings/settings')
            .onSnapshot((querySnapshot) => {
                this.appSettings = querySnapshot.data();
            });
    }

    private loadAppSetttings(): Promise<any> {
        return admin.firestore().doc('application_settings/settings')
            .get()
            .then(u => {
                this.appSettings = u.data();
                return this.appSettings;
            })
            .catch(error => {
                return error;
            });
    }

    public getAppSettings(): Promise<ApplicationSettings> {
        if (this.appSettings) {
            return Promise.resolve(this.appSettings);
        } else {
            return this.loadAppSetttings();
        }
    }
}
