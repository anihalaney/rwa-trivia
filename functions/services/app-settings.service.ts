const accountFireBaseClient = require('../db/firebase-client');
const accountFireStoreClient = accountFireBaseClient.firestore();
import { ApplicationSettings } from '../../projects/shared-library/src/lib/shared/model';
export class AppSettings {
    appSettings: ApplicationSettings;

    constructor() {
        accountFireStoreClient.doc('application_settings/settings')
            .onSnapshot((querySnapshot) => {
                this.appSettings = querySnapshot.data();
            });
    }

    private loadAppSetttings(): Promise<any> {
        return accountFireStoreClient.doc('application_settings/settings')
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
