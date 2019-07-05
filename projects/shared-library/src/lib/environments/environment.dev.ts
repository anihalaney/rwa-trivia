// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
import { IConfig } from './iconfig';
import { appConstants } from 'shared-library/shared/model';

export const environment = {
  production: true
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
  'functionsUrl': `https://rwa-trivia-dev-e57fc.firebaseapp.com/${appConstants.API_VERSION}`,
  'editorUrl': 'https://rwa-trivia-dev-e57fc.firebaseapp.com/trivia-editor',
  'hightlighJsURL' : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js',
  'hightlighCSSURL' : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/a11y-light.min.css',
  'katexCSSURL' : 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css',
  'addressByLatLongURL': 'https://maps.googleapis.com/maps/api/geocode/json',
  'addressSuggestionsURL': 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
};
