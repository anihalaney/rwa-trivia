const accountFireBaseClient = require('../db/firebase-client');
const accountFireStoreClient = accountFireBaseClient.firestore();

export class AppSettings {
    appSettings: Promise<any>;

    constructor() {
        accountFireStoreClient.doc('application_settings/settings')
            .onSnapshot((querySnapshot) => {
                this.appSettings = Promise.resolve(querySnapshot.data());
            });
    }

    private loadAppSetttings(): Promise<any> {
        return accountFireStoreClient.doc('application_settings/settings')
            .get()
            .then(u => {
                this.appSettings = Promise.resolve(u.data());
                return u.data();
            })
            .catch(error => {
                return error;
            });
    }

    public getAppSettings(): Promise<any> {
        if (this.appSettings) {
            return this.appSettings;
        } else {
            return this.loadAppSetttings();
        }
    }
}
