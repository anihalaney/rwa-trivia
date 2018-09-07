import { TEST_DATA } from '../../../testing/test.data';
import { scoreBoard, systemStat } from './stats.reducers';
import { StatsActions, StatsActionTypes } from '../actions';
import { Subscriber } from 'rxjs';
import { SystemStats } from '../../../../../../shared-library/src/lib/shared/model';

describe('Reducer: scoreBoard', () => {
    const _testReducer = scoreBoard;

    it('Initial State', () => {
        const state: any = _testReducer(undefined, { type: null, payload: null });

        expect(state).toEqual(null);
    });

    it('Total Subscriber Actions', () => {

        const data = [];
        data[0] = { '1': [{ 'score': 123, userId: '9K3sL9eHEZYXFZ68oRrW7a6wUmV2' }] };
        const newState: any = _testReducer(null, {
            type: StatsActionTypes.LOAD_LEADERBOARD_SUCCESS,
            payload: data
        });
        expect(newState).toEqual(data);

    });

    it('Any other action', () => {
        const state: any = _testReducer(null, { type: StatsActionTypes.LOAD_SYSTEM_STAT_SUCCESS, payload: null });
        expect(state).toEqual(null);
    });

});

describe('Reducer: systemStat', () => {
    const _testReducer = systemStat;

    it('Initial State', () => {
        const state: any = _testReducer(undefined, { type: null, payload: null });

        expect(state).toEqual(null);
    });

    it('Total Subscriber Actions', () => {

        const data = TEST_DATA.realTimeStats;

        const newState: any = _testReducer(null, {
            type: StatsActionTypes.LOAD_SYSTEM_STAT_SUCCESS,
            payload: data
        });
        expect(newState).toEqual(data);

        const errorState: String = _testReducer('Error while getting RealTime Stats Information',
            { type: StatsActionTypes.LOAD_SYSTEM_STAT_ERROR, payload: 'Error while getting RealTime Stats Information' });
        expect(errorState).toEqual('Error while getting RealTime Stats Information');

    });

    it('Any other action', () => {
        const state: any = _testReducer(null, { type: StatsActionTypes.LOAD_LEADERBOARD_SUCCESS, payload: null });
        expect(state).toEqual(null);
    });

});
