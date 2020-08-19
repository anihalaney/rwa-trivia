import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot } from 'jest-marbles';
import { Actions } from '@ngrx/effects';
import { testData } from 'test/data';
import { ApplicationSettingsEffects } from './application-settings.effects';
import { ApplicationSettingsService } from '../../../core/services/application-settings.service';
import { ApplicationSettingsActions } from '../actions';
import { ApplicationSettings } from '../../../shared/model';

describe('ApplicationSettingsEffects', () => {
    let effects: ApplicationSettingsEffects;
    let actions$: Observable<any>;
    let applicationSettingsService: any;
    const applicationSettings: ApplicationSettings[] = [testData.applicationSettings];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                ApplicationSettingsActions,
                ApplicationSettingsEffects,
                {
                    provide: ApplicationSettingsService,
                    useValue: { getApplicationSettings: jest.fn() }
                },
                provideMockActions(() => actions$),
            ],
        });
        effects = TestBed.get(ApplicationSettingsEffects);
        applicationSettingsService = TestBed.get(ApplicationSettingsService);
        actions$ = TestBed.get(Actions);
    });

    it('load application settings', () => {
        const action = new ApplicationSettingsActions().loadApplicationSettings();
        const completion = new ApplicationSettingsActions().loadApplicationSettingsSuccess(applicationSettings);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: applicationSettings });
        const expected = cold('--b', { b: completion });

        applicationSettingsService.getApplicationSettings = jest.fn(() => response);

        expect(effects.loadApplicationSettings$).toBeObservable(expected);
    });

});
