
import * as admin from 'firebase-admin';

class FirebaseClient {

    public admin: any;

    constructor() {
        this.admin = admin.initializeApp();
    }
}

export default new FirebaseClient().admin;



