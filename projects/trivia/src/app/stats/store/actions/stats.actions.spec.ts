import { Subscription, Subscribers, SystemStats } from '../../../../../../shared-library/src/lib/shared/model';
import { LoadLeaderBoard, LoadLeaderBoardSuccess, LoadSystemStat, LoadSystemStatSuccess } from './stats.actions';
import { StatsActionTypes } from './stats.actions';
import { TEST_DATA } from '../../../testing/test.data';

describe('LoadLeaderBoard data', () => {
    it('should create an action', () => {
        const action = new LoadLeaderBoard();
        expect(action.type).toEqual(StatsActionTypes.LOAD_LEADERBOARD);
    });
});

describe('LoadLeaderBoardSuccess', async () => {
    it('should create an action', () => {
        const data = [];
        data['1'] = [{ 'score': 123, userId: '9K3sL9eHEZYXFZ68oRrW7a6wUmV2' }];
        const action = new LoadLeaderBoardSuccess({ score: data });
        expect(action.type).toEqual(StatsActionTypes.LOAD_LEADERBOARD_SUCCESS);
        expect(action.payload.score).toEqual(data);
    });
});

describe('LoadSystemStat data', () => {
    it('should create an action', () => {
        const action = new LoadSystemStat();
        expect(action.type).toEqual(StatsActionTypes.LOAD_SYSTEM_STAT);
    });
});

describe('LoadSystemStatSuccess', async () => {
    it('should create an action', () => {
        const stats = TEST_DATA.realTimeStats;
        const action = new LoadSystemStatSuccess(stats);
        expect(action.type).toEqual(StatsActionTypes.LOAD_SYSTEM_STAT_SUCCESS);
        expect(action.payload).toEqual(stats);
    });
});
