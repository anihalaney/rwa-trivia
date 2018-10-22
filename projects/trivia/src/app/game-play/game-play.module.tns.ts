import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from 'shared-library/shared/shared.module';
import { GamePlayRoutingModule } from './routing/game-play-routing.module';
import { TNSCheckBoxModule } from 'nativescript-checkbox/angular';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUIAutoCompleteTextViewModule } from 'nativescript-ui-autocomplete/angular';
import {
  NewGameComponent, GameComponent
} from './components';
import { effects, reducer } from './store';

@NgModule({
  declarations: [
    NewGameComponent,
    GameComponent
  ],
  entryComponents: [
  ],
  imports: [
    // rwa modules
    SharedModule,
    GamePlayRoutingModule,
    TNSCheckBoxModule,
    NativeScriptUIListViewModule,
    NativeScriptUIAutoCompleteTextViewModule,
    //ngrx feature store
     StoreModule.forFeature('gameplay', reducer),

    //ngrx effects
     EffectsModule.forFeature(effects),

  ],
  providers: [
  ]
})
export class GamePlayModule { }
