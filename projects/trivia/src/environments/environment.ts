// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { IConfig } from './iconfig';

export const environment = {
  production: false
};


export const CONFIG: IConfig = {
  'firebaseConfig': {
    // apiKey: 'AIzaSyAqSJgn64UBZUbc7p7UDKSLOoburAENGDw',
    // authDomain: 'rwa-trivia-dev-e57fc.firebaseapp.com',
    // databaseURL: 'https://rwa-trivia-dev-e57fc.firebaseio.com',
    // projectId: 'rwa-trivia-dev-e57fc',
    // storageBucket: 'rwa-trivia-dev-e57fc.appspot.com',
    // messagingSenderId: '701588063269'

    apiKey: "AIzaSyBIUUxCxP3wEd4CZzyNSEx8Iq8LpHNFiVs",
    authDomain: "login-auth-839c6.firebaseapp.com",
    databaseURL: "https://login-auth-839c6.firebaseio.com",
    projectId: "login-auth-839c6",
    storageBucket: "login-auth-839c6.appspot.com",
    messagingSenderId: "475161979232"
  },
  'functionsUrl': 'https://rwa-trivia-dev-e57fc.firebaseapp.com'
};


/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
