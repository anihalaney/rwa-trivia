import { FirebaseAppConfig } from '@angular/fire';

export interface IConfig {
  firebaseConfig: FirebaseAppConfig;
  functionsUrl: string;
  addressByLatLongURL: string;
  addressSuggestionsURL: string;

}
