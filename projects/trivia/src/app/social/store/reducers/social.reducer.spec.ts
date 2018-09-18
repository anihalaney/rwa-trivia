import { TEST_DATA } from '../../../testing/test.data';
import { subscriptionSaveStatus, getTotalSubscriptionStatus, blogs } from './social.reducer';
import { SocialActions, SocialActionTypes } from '../actions';
import { Subscription, Subscribers, Blog } from '../../../../../../shared-library/src/lib/shared/model';
import { Subscriber } from 'rxjs';

describe('Reducer: subscriptionSaveStatus', () => {
    const _testReducer = subscriptionSaveStatus;

    it('Initial State', () => {
        const state: String = _testReducer(undefined, { type: null, payload: null });

        expect(state).toEqual('NONE');
    });

    it('Add Subscription Actions', () => {
        const state: String = _testReducer(null, {
            type: SocialActionTypes.ADD_SUBSCRIBER,
            payload: { subscription: { 'email': 'test@test.com' } }
        });
        expect(state).toEqual('IN PROCESS');

        const newState: String = _testReducer('SUCCESS', { type: SocialActionTypes.ADD_SUBSCRIBER_SUCCESS, payload: null });
        expect(newState).toEqual('SUCCESS');

        const errorState: String = _testReducer('Error while saving Subscription',
            { type: SocialActionTypes.ADD_SUBSCRIBER_ERROR, payload: 'Error while saving Subscription' });
        expect(errorState).toEqual('Error while saving Subscription');
    });

    it('Any other action', () => {
        const state: String = _testReducer('SUCCESS', { type: SocialActionTypes.TOTAL_SUBSCRIBER_SUCCESS, payload: null });
        expect(state).toEqual('SUCCESS');
    });

});
describe('Reducer: getTotalSubscriptionStatus', () => {
    const _testReducer = getTotalSubscriptionStatus;

    it('Initial State', () => {
        const state: Subscribers = _testReducer(undefined, { type: null, payload: null });

        expect(state).toEqual(<Subscribers>[]);
    });

    it('Total Subscriber Actions', () => {

        const subscriber: Subscribers = { count: 3 };
        const newState: Subscribers = _testReducer(<Subscribers>[], {
            type: SocialActionTypes.TOTAL_SUBSCRIBER_SUCCESS,
            payload: subscriber
        });
        expect(newState).toEqual(subscriber);

    });

    it('Any other action', () => {
        const state: Subscribers = _testReducer(<Subscribers>[], { type: SocialActionTypes.ADD_SUBSCRIBER_SUCCESS, payload: null });
        expect(state).toEqual(<Subscribers>[]);
    });

});

describe('Reducer: blogs', () => {
    const _testReducer = blogs;

    it('Initial State', () => {
        const state: Blog[] = _testReducer(undefined, { type: null, payload: [] });
        expect(state).toEqual(null);
    });

    it('Total Blogs Actions', () => {

        const blog: Blog[] = TEST_DATA.blog;
        const newState: Blog[] = _testReducer(<Blog[]>[], {
            type: SocialActionTypes.LOAD_BLOGS_SUCCESS,
            payload: blog
        });
        expect(newState).toEqual(blog);

        const errorState: String = _testReducer('Error while getting Blogs',
            { type: SocialActionTypes.LOAD_BLOGS_ERROR, payload: 'Error while getting Blogs' });
        expect(errorState).toEqual('Error while getting Blogs');

    });

    it('Any other action', () => {
        const state: Subscribers = _testReducer(<Subscribers>[], { type: SocialActionTypes.ADD_SUBSCRIBER_SUCCESS, payload: null });
        expect(state).toEqual(<Subscribers>[]);
    });

});