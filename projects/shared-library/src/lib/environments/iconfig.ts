import { FirebaseAppConfig } from '@angular/fire';

export interface IConfig {
  firebaseConfig: FirebaseAppConfig;
  functionsUrl: string;
  editorUrl: string;
  ua_id: string;
  termsAndConditionsUrl: string;
  privacyUrl: string;
  addressByLatLongURL: string;
  addressSuggestionsURL: string;
}
