
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


class FirebaseClient {

    public admin: any;

    constructor() {
        // There is bug with firebase-function  in production not in function emulator
        // behavior keep changing version over version
        // https://github.com/firebase/firebase-functions/issues/311
         this.admin = admin.initializeApp(functions.config().firebase);
    }
}

export default new FirebaseClient().admin;



