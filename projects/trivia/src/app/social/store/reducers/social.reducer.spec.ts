import { TEST_DATA } from '../../../testing/test.data';
import { subscriptionSaveStatus, getTotalSubscriptionStatus } from './social.reducer';
import { SocialActions, SocialActionTypes } from '../actions';
import { Subscription, Subscribers } from '../../../model';
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
