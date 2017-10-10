import { NgModule } from '@angular/core';

import { SharedModule } from  '../shared/shared.module';
import { UserRoutingModule } from  './routing/user-routing.module';

import { 
  ProfileCardComponent, 
  UserStatsCardComponent,
  GameCardComponent,
  GameInviteComponent,
  RecentGamesComponent,
  ProfileSettingsComponent,
  MyQuestionsComponent,
  QuestionAddUpdateComponent} from  './components';

@NgModule({
  declarations: [
    ProfileCardComponent,
    UserStatsCardComponent,
    GameCardComponent,
    GameInviteComponent,
    RecentGamesComponent,
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    UserRoutingModule
  ],
  providers: [ 
  ],                                                                      
  exports:  [ 
    ProfileCardComponent,
    UserStatsCardComponent,
    GameCardComponent,
    GameInviteComponent,
    RecentGamesComponent,
    ProfileSettingsComponent,
    MyQuestionsComponent,
    QuestionAddUpdateComponent
  ]
})
export class UserModule { }
