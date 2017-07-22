import { NgModule, ModuleWithProviders } from '@angular/core';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CONFIG } from '../../environments/environment';

import { Utils, AuthenticationService, AuthGuard,
         CategoryService, TagService, QuestionService,
         GameService } from './services';

import { UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions, GameActions } from './store/actions';
import { UserEffects, CategoryEffects, TagEffects, QuestionEffects, GameEffects } from './store/effects';
import { reducer } from './store/app-store';

import { LoginComponent, PasswordAuthComponent } from './components';

import { SharedModule } from  '../shared/shared.module';
 
export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;

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
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    
    //store
    StoreModule.forRoot(reducer),
    StoreDevtoolsModule.instrument({
      maxAge: 20
    }),

    //ngrx effects
    EffectsModule.forFeature([
      UserEffects,
      CategoryEffects,
      TagEffects,
      QuestionEffects,
      GameEffects
    ]),

    //rwa module
    SharedModule
  ],
  providers: [ 
    //Services
    Utils, AuthenticationService, AuthGuard,
    CategoryService, TagService, QuestionService,
    GameService,

    //Actions
    UserActions, CategoryActions, TagActions, QuestionActions, 
    UIStateActions, GameActions

  ]
})
export class CoreModule { };
