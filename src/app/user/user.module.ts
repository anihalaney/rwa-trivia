import { NgModule } from '@angular/core';
import { RouterModule }  from '@angular/router';

import { SharedModule } from  '../shared/shared.module';
import { 
  ProfileCardComponent, 
  UserStatsCardComponent,
  GameCardComponent,
  GameInviteComponent,
  RecentGamesComponent } from  './components';

@NgModule({
  declarations: [
    ProfileCardComponent,
    UserStatsCardComponent,
    GameCardComponent,
    GameInviteComponent,
    RecentGamesComponent
  ],
  imports: [
    //rwa modules
    SharedModule,
    RouterModule
  ],
  providers: [ 
  ],                                                                      
  exports:  [ 
    ProfileCardComponent,
    UserStatsCardComponent,
    GameCardComponent,
    GameInviteComponent,
    RecentGamesComponent
  ]
})
export class UserModule { }
