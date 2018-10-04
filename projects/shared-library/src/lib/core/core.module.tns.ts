import { NgModule, ModuleWithProviders } from '@angular/core';

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

@NgModule({
  declarations: [

  ],

  entryComponents: [
  ],
  imports: [

    //store
    StoreModule.forFeature('core', reducer),

    //ngrx effects
    EffectsModule.forFeature(effects),

  ],
  providers: [

    Utils,
    CategoryService, TagService, QuestionService,
    GameService, BulkService, UserService, SocialService, StatsService,
    WindowRef,

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
