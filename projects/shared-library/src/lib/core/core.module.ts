import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AngularFireModule, FirebaseAppConfig } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CONFIG } from '../environments/environment';

import {
  Utils,
  CategoryService, TagService, QuestionService,
  GameService, BulkService, UserService, SocialService, StatsService,
  WindowRef
} from './services';

import { AuthenticationProvider, AuthInterceptor } from './auth';

import { AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver, AdminLoadGuard } from './route-guards';

import { UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions, GameActions } from './store/actions';
import { UserEffects, CategoryEffects, TagEffects, QuestionEffects, GameEffects, effects } from './store/effects';
import { reducer } from './store';

import { LoginComponent } from './components';

import { SharedModule } from '../shared/shared.module';
import { DbService } from './db-service';
import { WebDbService } from './db-service/web/db.service';
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
    GameService, BulkService, UserService, SocialService, StatsService,
    WindowRef,

    //route guards
    AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver, AdminLoadGuard,

    //Actions
    UserActions, CategoryActions, TagActions, QuestionActions,
    UIStateActions, GameActions,
    WebDbService,
    {
      provide: DbService,
      useClass: WebDbService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ]
})
export class CoreModule { };
