import { NgModule, ModuleWithProviders } from '@angular/core';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AuthenticationService, AuthGuard,
         CategoryService, TagService, QuestionService } from './services';

import { UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions } from './store/actions';
import { UserEffects, CategoryEffects, TagEffects, QuestionEffects } from './store/effects';
import { default as reducer } from './store/app-store';

import { LoginComponent, PasswordAuthComponent } from './components';

import { SharedModule } from  '../shared/shared.module';

export const firebaseConfig: FirebaseAppConfig = {
    apiKey: "AIzaSyDIEpabJv44Iu7go6M30T3WAF-GlSMcR7Y",
    authDomain: "rwa-trivia.firebaseapp.com",
    databaseURL: "https://rwa-trivia.firebaseio.com",
    storageBucket: "rwa-trivia.appspot.com",
    messagingSenderId: "479350787602"
};

@NgModule({
  declarations: [
    LoginComponent, PasswordAuthComponent
  ],

  entryComponents: [
    LoginComponent, PasswordAuthComponent
  ],
  imports: [
    //firebase
    AngularFireModule.initializeApp(firebaseConfig),
    
    //store
    StoreModule.provideStore(reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension({
      maxAge: 20
    }),

    //ngrx effects
    EffectsModule.run(UserEffects),
    EffectsModule.run(CategoryEffects),
    EffectsModule.run(TagEffects),
    EffectsModule.run(QuestionEffects),

    //rwa module
    SharedModule
  ],
  providers: [ 
    //Services
    AuthenticationService, AuthGuard,
    CategoryService, TagService, QuestionService,

    //Actions
    UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions

  ]
})
export class CoreModule { };
