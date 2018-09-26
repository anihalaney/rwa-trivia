import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import {
  Utils,
  CategoryService, TagService, QuestionService,
  GameService, BulkService, UserService, SocialService, StatsService,
  WindowRef
} from './services';

import { DbService } from './db-service';
import { TNSDbService } from './db-service/mobile/db.service';
import { FirebaseService } from './db-service/firebase.service';

import { UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions, GameActions } from './store/actions';
import { effects } from './store/effects';
import { reducer } from './store';

// export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;


@NgModule({
  declarations: [

  ],

  entryComponents: [
  ],
  imports: [

    //store
    StoreModule.forFeature('core', reducer),
    //StoreModule.forRoot(reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

    //rwa module
    // SharedModule
  ],
  providers: [
    //Services
    Utils,
    // AuthenticationProvider,
    CategoryService, TagService, QuestionService,
    GameService, BulkService, UserService, SocialService, StatsService,
    WindowRef,

    //route guards
    // AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver, AdminLoadGuard,

    //Actions
    UserActions, CategoryActions, TagActions, QuestionActions,
    UIStateActions, GameActions,
    UserActions,
    TNSDbService,
    FirebaseService,
    {
      provide: DbService,
      useClass: TNSDbService
    }
  ]
})
export class CoreModule {
  constructor() {

  }
};
