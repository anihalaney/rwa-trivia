import { IConfig } from 'shared-library/environments/iconfig';
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
  'functionsUrl': 'https://bitwiser-edu.firebaseapp.com',
  'editorUrl': 'https://bitwiser-edu.firebaseapp.com/editor',
  'hightlighJsURL': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js',
  'hightlighCSSURL': 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/a11y-light.min.css',
  'katexCSSURL': 'https://cdn.jsdelivr.net/npm/katex@0.10.1/dist/katex.min.css',
  'addressByLatLongURL': 'https://maps.googleapis.com/maps/api/geocode/json',
  'addressSuggestionsURL': 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
};


export const projectMeta = {
  projectName: 'bitwiser-edu',
  projectDisplayName: 'Bitwiser-edu',
  title: 'bitwiser.io: get wiser - bit by bit',
  playStoreUrl: '',
  appStoreUrl: '',
  blogUrl: 'https://bitwiser.io'
};
