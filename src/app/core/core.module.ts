import { NgModule, ModuleWithProviders } from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { CONFIG } from '../../environments/environment';

import { Utils, AuthenticationService, AuthInterceptor,
         CategoryService, TagService, QuestionService,
         GameService, FileSummaryService } from './services';

import { AuthGuard, AdminLoadGuard, BulkLoadGuard, CategoriesResolver, TagsResolver } from './services';

 import { UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions, GameActions, FileSummaryActions } from './store/actions';
import { UserEffects, CategoryEffects, TagEffects, QuestionEffects, GameEffects, FileSummaryEffects } from './store/effects';
import { reducer } from './store/app-store';

import { LoginComponent } from './components';

import { SharedModule } from  '../shared/shared.module';
 
export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;

@NgModule({
  declarations: [
    LoginComponent
  ],

  entryComponents: [
    LoginComponent
  ],
  imports: [
    //firebase
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    
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
      GameEffects,
      FileSummaryEffects
    ]),

    //rwa module
    SharedModule
  ],
  providers: [ 
    //Services
    Utils, AuthenticationService, 
    CategoryService, TagService, QuestionService,
    GameService,FileSummaryService,
    
    //route guards
    AuthGuard, AdminLoadGuard, BulkLoadGuard, CategoriesResolver, TagsResolver,

    //Actions
    UserActions, CategoryActions, TagActions, QuestionActions, 
    UIStateActions, GameActions,FileSummaryActions,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule { };
