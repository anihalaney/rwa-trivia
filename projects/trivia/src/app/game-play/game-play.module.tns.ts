import { NgModule } from '@angular/core';
import { SharedModule } from 'shared-library/shared/shared.module';
import { GamePlayRoutingModule } from './routing/game-play-routing.module';
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import {
  NewGameComponent
} from './components';

@NgModule({
  declarations: [
    NewGameComponent
  ],
  entryComponents: [
  ],
  imports: [
    // rwa modules
    SharedModule,
    GamePlayRoutingModule,
    TNSCheckBoxModule,
    NativeScriptUIListViewModule,
    NativeScriptUIAutoCompleteTextViewModule
    //ngrx feature store
    // StoreModule.forFeature('gameplay', reducer),

    //ngrx effects
    // EffectsModule.forFeature(effects),

  ],
  providers: [
  ]
})
export class GamePlayModule { }
