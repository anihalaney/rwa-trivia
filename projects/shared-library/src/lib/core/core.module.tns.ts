import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {
  Utils,
  CategoryService, TagService, QuestionService,
  GameService, BulkService, UserService, SocialService, StatsService,
  WindowRef, ApplicationSettingsService, AchievementService
} from './services';

import { NavigationService } from './services/mobile/navigation.service';

import { AuthenticationProvider, AuthInterceptor } from './auth';

import { AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver } from './route-guards';

import { DbService } from './db-service';
import { TNSDbService } from './db-service/mobile/db.service';
import { FirebaseService } from './db-service/firebase.service';

import {
  UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions, GameActions,
  ApplicationSettingsActions
} from './store/actions';
import { effects } from './store/effects';
import { reducer } from './store';

import { SharedRoutingModule } from './routing/shared-routing.module';

import { LoginComponent } from './components';
import { SharedModule } from './../shared/shared.module';

import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { FirebaseAuthService } from './auth/firebase-auth.service';
import { TNSFirebaseAuthService } from './auth/mobile/firebase-auth.service';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [

    // store
    StoreModule.forFeature('core', reducer),

    // ngrx effects
    EffectsModule.forFeature(effects),

    SharedRoutingModule,
    SharedModule

  ],
  exports: [],

  providers: [

    Utils, AuthenticationProvider,
    CategoryService, TagService, QuestionService,
    GameService, BulkService, UserService, SocialService, StatsService, NavigationService,
    WindowRef, ApplicationSettingsService, AchievementService,

    // Actions
    UserActions, CategoryActions, TagActions, QuestionActions,
    UIStateActions, GameActions,
    UserActions, ApplicationSettingsActions,

    TNSDbService,
    FirebaseService,
    {
      provide: DbService,
      useClass: TNSDbService
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    TNSFirebaseAuthService, {
      provide: FirebaseAuthService,
      useClass: TNSFirebaseAuthService
    },
    // Route guards
    AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class CoreModule {
  constructor() {

  }
}
