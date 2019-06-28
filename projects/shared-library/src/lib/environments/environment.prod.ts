import { IConfig } from './iconfig';
import { appConstants } from 'shared-library/shared/model';
export const environment = {
  production: true
};

export const CONFIG: IConfig = {
  'firebaseConfig': {
    apiKey: 'AIzaSyDIEpabJv44Iu7go6M30T3WAF-GlSMcR7Y',
    authDomain: 'bitwiser.io',
    databaseURL: 'https://rwa-trivia.firebaseio.com',
    projectId: 'rwa-trivia',
    storageBucket: 'rwa-trivia.appspot.com',
    messagingSenderId: '479350787602',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=io.bitwiser.trivia',
    iTunesUrl: 'https://itunes.apple.com/us/app/bitwiser-trivia/id1447244501?ls=1&mt=8'
  },
  'functionsUrl': `https://bitwiser.io/${appConstants.API_VERSION}`,
  'editorUrl': 'https://bitwiser.io/editor',
  'hightlighJsURL' : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js',
  'hightlighCSSURL' : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/a11y-light.min.css',
  'katexCSSURL' : 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css',
  'addressByLatLongURL': 'https://maps.googleapis.com/maps/api/geocode/json',
  'addressSuggestionsURL': 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
};
