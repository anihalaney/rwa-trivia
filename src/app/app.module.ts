import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { RoutingModule } from './routing/routing.module';
//import { MyQuestionsModule } from  './myQuestions/my-questions.module';
import { GamePlayModule } from './game-play/game-play.module';
import { SocialModule } from './social/social.module';
import { UserModule } from './user/user.module';
import { StatsModule } from './stats/stats.module';

import {
  AppComponent, DashboardComponent,
  SideNavComponent, HeaderComponent, FooterComponent
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SideNavComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    EffectsModule.forRoot([]),

    //rwa modules
    CoreModule,
    SharedModule,
    RoutingModule,
    // MyQuestionsModule,
    GamePlayModule,
    SocialModule,
    UserModule,
    StatsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
