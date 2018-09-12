import { NgModule, ModuleWithProviders } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CONFIG } from '../environments/environment';

import {
  Utils,
  CategoryService, TagService, QuestionService,
  GameService, BulkService, UserService, SocialService, StatsService,
  WindowRef
} from './services';

// import { AuthenticationProvider, AuthInterceptor } from './auth';
import { DbService, TNSDbService } from './db-service'

// import { AuthGuard, BulkLoadGuard, CategoriesResolver, TagsResolver, AdminLoadGuard } from './route-guards';

import { UserActions, CategoryActions, TagActions, QuestionActions, UIStateActions, GameActions } from './store/actions';
import { UserEffects, CategoryEffects, TagEffects, QuestionEffects, GameEffects, effects } from './store/effects';
import { reducer } from './store';

// import { LoginComponent } from './components';

// import { SharedModule } from '../shared/shared.module';

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
    {
      provide: DbService,
      useClass: TNSDbService
    }
  ]
})
export class CoreModule {
  constructor() {
    console.log('in tns modules');
  }
};
