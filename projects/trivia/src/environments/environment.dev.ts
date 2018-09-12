// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
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
