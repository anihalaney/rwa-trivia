// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
import { IConfig } from './iconfig';

export const environment = {
  production: true
};

export const CONFIG: IConfig = {
  'firebaseConfig': {
    apiKey: 'AIzaSyBbD7dMiOBXLPVFquP-6sdif8MkxYBYJb0',
    authDomain: 'bitwiser-edu.firebaseapp.com',
    databaseURL: 'https://bitwiser-edu.firebaseio.com',
    projectId: 'bitwiser-edu',
    storageBucket: 'bitwiser-edu.appspot.com',
    messagingSenderId: '704157888306'
  },
  'functionsUrl': 'http://localhost:5000/bitwiser-edu/us-central1/app'
  };
