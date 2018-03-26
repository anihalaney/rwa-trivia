import * as firebase from 'firebase/app';

export class Subscription {
    id?: string;
    userId: string;
    email: string;

    constructor(obj: any) {
        this.userId = obj.userId;
        this.email = obj.email;


    }
}
