const fs = require('fs');
const path = require('path');
const firebaseConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../config/firebase.config.json'), 'utf8'));

export class FirebaseConfig {

    productionConfig = firebaseConfig.prodConfig;
    devConfig = firebaseConfig.devConfig;

    constructor() { }

    identifyConfigApp(appConfig: any) {
        if (appConfig.projectId === this.productionConfig.projectId) {
            return this.productionConfig;
        } else {
            return appConfig;
        }
    }
}
