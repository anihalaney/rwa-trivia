import { NgModule, ModuleWithProviders } from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CONFIG } from '../../environments/environment';

import { Utils, AuthenticationService, AuthInterceptor,
         CategoryService, TagService, QuestionService,
         GameService } from './services';

import { AuthGuard, AdminLoadGuard, BulkLoadGuard, CategoriesResolver, TagsResolver } from './services';

import { UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions, GameActions } from './store';
import { effects } from './store/effects';
import { reducer } from './store';

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
    StoreModule.forFeature('core', reducer),
    //StoreModule.forRoot(reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

    //rwa module
    SharedModule
  ],
  providers: [ 
    //Services
    Utils, AuthenticationService, 
    CategoryService, TagService, QuestionService,
    GameService,
    
    //route guards
    AuthGuard, AdminLoadGuard, BulkLoadGuard, CategoriesResolver, TagsResolver,

    //Actions
    UserActions, CategoryActions, TagActions, QuestionActions, 
    UIStateActions, GameActions,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule { };
