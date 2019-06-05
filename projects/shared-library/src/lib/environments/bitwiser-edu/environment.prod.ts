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
  'functionsUrl': 'https://bitwiser-edu.firebaseapp.com'
};


export const projectDetail = {
  projectName: 'bitwiser-edu',
  projectDisplayName: 'Bitwiser-edu',
  title: 'bitwiser.io: get wiser - bit by bit'
};
