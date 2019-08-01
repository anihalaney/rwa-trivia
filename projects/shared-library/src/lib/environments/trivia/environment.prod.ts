import { IConfig } from 'shared-library/environments/iconfig';
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
    messagingSenderId: '479350787602'
  },
  'functionsUrl': `https://bitwiser.io`,
  'editorUrl': 'https://bitwiser.io/editor',
  'termsAndConditionsUrl': 'https://bitwiser.io/terms-and-conditions',
  'privacyUrl': 'https://bitwiser.io/terms-and-conditions',
  'ua_id': 'UA-122807814-1'
};

export const projectMeta = {
  projectName: 'rwa-trivia',
  projectDisplayName: 'Trivia',
  title: 'bitwiser.io: get wiser - bit by bit',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=io.bitwiser.trivia',
  appStoreUrl: 'https://itunes.apple.com/us/app/bitwiser-trivia/id1447244501?mt=8',
  blogUrl: 'https://bitwiser.io'
};
