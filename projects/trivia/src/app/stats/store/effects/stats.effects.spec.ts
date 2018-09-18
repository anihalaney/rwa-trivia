import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { Actions } from '@ngrx/effects';
import { TEST_DATA } from '../../../testing/test.data';
import { StatsEffects } from './stats.effects';
import { StatsService } from '../../../../../../shared-library/src/lib/core/services/stats.service';
import { LoadLeaderBoard, LoadLeaderBoardSuccess, LoadSystemStat, LoadSystemStatSuccess } from '../actions';
import { StoreModule, Store } from '@ngrx/store';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFirestore, AngularFirestoreModule } from 'angularfire2/firestore';
import { CONFIG } from '../../../../../../shared-library/src/lib/environments/environment';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireStorageModule } from 'angularfire2/storage';
export const firebaseConfig: FirebaseAppConfig = CONFIG.firebaseConfig;

describe('Effects: StatsEffects', () => {
    let effects: StatsEffects;
    let actions$: Observable<any>;
    let statsService: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({}), AngularFireModule.initializeApp(firebaseConfig),
                AngularFirestoreModule, AngularFirestoreModule, AngularFireStorageModule],
            providers: [
                AngularFirestore,
                StatsEffects,
                {
                    provide: StatsService,
                    useValue: { loadSystemStat: jest.fn(), loadLeaderBoardStat: jest.fn() },
                },
                provideMockActions(() => actions$),
                {
                    provide: HTTP_INTERCEPTORS,
                    multi: true,
                }
            ],
        });

        effects = TestBed.get(StatsEffects);
        statsService = TestBed.get(StatsService);
        actions$ = TestBed.get(Actions);
    });

    it('LoadLeaderBoardInfo', () => {
        const data = [];
        data[0] = { '1': [{ 'score': 123, userId: '9K3sL9eHEZYXFZ68oRrW7a6wUmV2' }] };
        const action = new LoadLeaderBoard();
        const completion = new LoadLeaderBoardSuccess(data);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: data });
        const expected = cold('--b', { b: completion });
        statsService.loadLeaderBoardStat = jest.fn(() => response);
        expect(effects.LoadLeaderBoardInfo$).toBeObservable(expected);
    });

    it('LoadSystemStat', () => {
        const data = TEST_DATA.realTimeStats;
        const action = new LoadSystemStat();
        const completion = new LoadSystemStatSuccess(data);
        actions$ = hot('-a---', { a: action });
        const response = cold('-a|', { a: data });
        const expected = cold('--b', { b: completion });
        statsService.loadSystemStat = jest.fn(() => response);
        expect(effects.LoadSystemStat$).toBeObservable(expected);
    });

});