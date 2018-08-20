import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CONFIG } from '../../environments/environment';

import {
  Utils,
  CategoryService, TagService, QuestionService,
  UserService, BulkService
} from './services';

import { AuthenticationProvider, AuthInterceptor } from './auth';

import { AuthGuard, AdminLoadGuard, CategoriesResolver, TagsResolver } from './route-guards';

import { UserActions, CategoryActions, TagActions, UIStateActions } from './store/actions';
import { UserEffects, CategoryEffects, TagEffects, effects } from './store/effects';
import { reducer } from './store';

import { LoginComponent } from './components';

import { SharedModule } from '../../../../shared-library/src/public_api';

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
    Utils, AuthenticationProvider,
    CategoryService, TagService, QuestionService,
    UserService, BulkService,

    //route guards
    AuthGuard, AdminLoadGuard, CategoriesResolver, TagsResolver,

    //Actions
    UserActions, CategoryActions, TagActions,
    UIStateActions,

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule { };
