import { ApplicationSettings } from '../../../shared/model';
import { ApplicationSettingsActions } from './application-settings.actions';
import { testData } from 'test/data';

describe('loadApplicationSettings', () => {
    it('should create an action', () => {
        const action = new ApplicationSettingsActions().loadApplicationSettings();
        expect(action.type).toEqual(ApplicationSettingsActions.LOAD_APPLICATION_SETTINGS);
        expect(action.payload).toEqual(null);
    });
});

describe('loadApplicationSettingsSuccess', () => {
    it('should create an action', () => {
        const applicationSettings: any = testData.applicationSettings;
        const action = new ApplicationSettingsActions().loadApplicationSettingsSuccess(applicationSettings);
        expect(action.type).toEqual(ApplicationSettingsActions.LOAD_APPLICATION_SETTINGS_SUCCESS);
        expect(action.payload).toEqual(applicationSettings);
    });
});