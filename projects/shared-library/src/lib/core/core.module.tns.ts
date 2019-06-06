import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from './../shared/shared.module';
import { AuthenticationProvider, AuthInterceptor } from './auth';
import { FirebaseAuthService } from './auth/firebase-auth.service';
import { TNSFirebaseAuthService } from './auth/mobile/firebase-auth.service';
import { LoginComponent } from './components';
import { DbService } from './db-service';
import { FirebaseService } from './db-service/firebase.service';
import { TNSDbService } from './db-service/mobile/db.service';
import { AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver } from './route-guards';
import { SharedRoutingModule } from './routing/shared-routing.module';
import {
  AchievementService, ApplicationSettingsService,
  BulkService, CategoryService, GameService, QuestionService,
  SocialService, StatsService, TagService, UserService, Utils, WindowRef
} from './services';
import { NavigationService } from './services/mobile';
import { reducer } from './store';
import {
  ApplicationSettingsActions, CategoryActions,
  GameActions, QuestionActions, TagActions, UIStateActions, UserActions
} from './store/actions';
import { effects } from './store/effects';


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
