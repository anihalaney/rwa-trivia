// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
import { IConfig } from 'shared-library/environments/iconfig';
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
    messagingSenderId: '701588063269'
  },
  'functionsUrl': `https://rwa-trivia-dev-e57fc.firebaseapp.com/${appConstants.API_VERSION}`,
  'editorUrl': 'https://rwa-trivia-dev-e57fc.firebaseapp.com/editor',
  'termsAndConditionsUrl': 'https://bitwiser.io/terms-and-conditions',
  'privacyUrl': 'https://bitwiser.io/privacy-policy',
  'ua_id': 'UA-122807814-1',
};

export const projectMeta = {
  projectName: 'rwa-trivia',
  projectDisplayName: 'Trivia',
  title: 'bitwiser.io: get wiser - bit by bit',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=io.bitwiser.trivia',
  appStoreUrl: 'https://itunes.apple.com/us/app/bitwiser-trivia/id1447244501?mt=8',
  blogUrl: 'https://bitwiser.io'
};
