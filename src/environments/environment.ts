// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
import { IConfig } from './iconfig';

export const environment = {
  production: false
};

export const CONFIG: IConfig = {
  "firebaseConfig" : {
      apiKey: "AIzaSyDIEpabJv44Iu7go6M30T3WAF-GlSMcR7Y",
      authDomain: "rwa-trivia.firebaseapp.com",
      databaseURL: "https://rwa-trivia.firebaseio.com",
      projectId: 'rwa-trivia',
      storageBucket: "rwa-trivia.appspot.com",
      messagingSenderId: "479350787602"
  },
   "functionsUrl": "https://us-central1-rwa-trivia.cloudfunctions.net"
};
