// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
import { IConfig } from 'shared-library/environments/iconfig';
import { appConstants } from 'shared-library/shared/model';

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
  'functionsUrl': `https://bitwiser-edu.firebaseapp.com/${appConstants.API_VERSION}`,
  'editorUrl': 'https://bitwiser-edu.firebaseapp.com/editor',
  'termsAndConditionsUrl': 'https://bitwiser-edu.firebaseapp.com/terms-and-conditions',
  'privacyUrl': 'https://bitwiser-edu.firebaseapp.com/privacy-policy',
  'ua_id': 'UA-122807814-1'
};

export const projectMeta = {
  projectName: 'bitwiser-edu',
  projectDisplayName: 'Bitwiser-edu',
  title: 'bitwiser.io: get wiser - bit by bit',
  playStoreUrl: '',
  appStoreUrl: '',
  blogUrl: 'https://bitwiser.io'
};
