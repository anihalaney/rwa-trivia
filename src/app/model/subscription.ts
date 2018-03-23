import * as firebase from 'firebase/app';

export class Subscription {
    id?: string;
    created_uid: string;
    email: string;

    constructor(email: string, userId: string) {
        this.created_uid = userId;
        this.email = email;


    }
}
