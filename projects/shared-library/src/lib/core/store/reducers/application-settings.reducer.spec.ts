import { testData } from 'test/data';
import { ApplicationSettingsActions } from '../actions';
import { applicationSettings } from './application-settings.reducer';

describe('Reducer: applicationSettings', () => {
  const _testReducer = applicationSettings;

  it('Initial State', () => {
    const state: String[] = _testReducer(undefined, { type: null, payload: null });
    expect(state).toEqual([]);
  });

  it('Get Load application settings success', () => {
    const newState: String[] = _testReducer(undefined,
      { type: ApplicationSettingsActions.LOAD_APPLICATION_SETTINGS_SUCCESS, payload: [testData.applicationSettings] });
    expect(newState).toEqual([testData.applicationSettings]);
  });

});


