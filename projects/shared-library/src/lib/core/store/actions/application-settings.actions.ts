import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { ApplicationSettings } from '../../../shared/model';

@Injectable()
export class ApplicationSettingsActions {


  static LOAD_APPLICATION_SETTINGS = 'LOAD_APPLICATION_SETTINGS';
  static LOAD_APPLICATION_SETTINGS_SUCCESS = 'LOAD_APPLICATION_SETTINGS_SUCCESS';

  loadApplicationSettings(): ActionWithPayload<null> {
    return {
      type: ApplicationSettingsActions.LOAD_APPLICATION_SETTINGS,
      payload: null
    };
  }
  loadApplicationSettingsSuccess(applicationSettings: ApplicationSettings[]): ActionWithPayload<any[]> {
    return {
      type: ApplicationSettingsActions.LOAD_APPLICATION_SETTINGS_SUCCESS,
      payload: applicationSettings
    };
  }

}
