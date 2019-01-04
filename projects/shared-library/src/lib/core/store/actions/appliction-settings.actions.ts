import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { Category } from '../../../shared/model';

@Injectable()
export class ApplicationSettingsActions {

  static LOAD_APPLICATION_SETTINGS_SUCCESS = 'LOAD_APPLICATION_SETTINGS_SUCCESS';
  loadApplicationSettingsSuccess(applicationSettings: any[]): ActionWithPayload<any[]> {
    return {
      type: ApplicationSettingsActions.LOAD_APPLICATION_SETTINGS_SUCCESS,
      payload: applicationSettings
    };
  }

}
