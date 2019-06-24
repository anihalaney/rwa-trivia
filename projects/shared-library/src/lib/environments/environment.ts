// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
import { IConfig } from './iconfig';
import { appConstants } from 'shared-library/shared/model';

export const environment = {
  production: false
};

export const CONFIG: IConfig = {
  'firebaseConfig': {
    apiKey: 'AIzaSyAqSJgn64UBZUbc7p7UDKSLOoburAENGDw',
    authDomain: 'rwa-trivia-dev-e57fc.firebaseapp.com',
    databaseURL: 'https://rwa-trivia-dev-e57fc.firebaseio.com',
    projectId: 'rwa-trivia-dev-e57fc',
    storageBucket: 'rwa-trivia-dev-e57fc.appspot.com',
    messagingSenderId: '701588063269',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=io.bitwiser.trivia.dev',
    iTunesUrl: 'https://itunes.apple.com/us/app/bitwiser-trivia/id1447131917?ls=1&mt=8'
  },

  'functionsUrl': ` http://192.168.0.101:5001/rwa-trivia-dev-e57fc/us-central1/app/${appConstants.API_VERSION}`,
  'editorUrl': 'https://rwa-trivia-dev-e57fc.firebaseapp.com/editor',
  'hightlighJsURL' : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js',
  'hightlighCSSURL' : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/a11y-light.min.css',
  'katexCSSURL' : 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css',

};
