
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

class FirebaseClient {

    public admin: any;

    constructor() {
        this.admin = admin.initializeApp(functions.config().firebase);
    }
}

export default new FirebaseClient().admin;



