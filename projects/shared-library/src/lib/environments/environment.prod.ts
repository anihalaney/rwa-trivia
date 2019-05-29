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
  'functionsUrl': `https://bitwiser.io/${appConstants.API_VERSION}`
};
