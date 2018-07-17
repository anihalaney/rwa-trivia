import { Subscription, User, Subscribers } from '../../../model';
import { LoadLeaderBoard, LoadLeaderBoardSuccess } from './stats.actions';
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
