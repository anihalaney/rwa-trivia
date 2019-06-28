import { FirebaseAppConfig } from '@angular/fire';

export interface IConfig {
  firebaseConfig: FirebaseAppConfig;
  functionsUrl: string;
  addressByLatLongURL: string;
  addressSuggestionsURL: string;
  editorUrl: string;
  hightlighJsURL: string;
  hightlighCSSURL: string;
  katexCSSURL: string;
}
