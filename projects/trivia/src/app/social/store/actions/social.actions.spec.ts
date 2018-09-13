import { Subscription, User, Subscribers, Blog } from '../../../../../../shared-library/src/lib/shared/model';
import {
    AddSubscriber, AddSubscriberSuccess, GetTotalSubscriber, GetTotalSubscriberSuccess,
    LoadBlogs, LoadBlogsSuccess
} from './social.actions'
import { SocialActionTypes } from './social.actions';
import { TEST_DATA } from '../../../testing/test.data';

describe('AddSubscriber for normal user', () => {
    it('should create an action', () => {
        const obj = new Subscription();
        obj.email = 'test@test.com';
        const action = new AddSubscriber({ subscription: obj });
        expect(action.type).toEqual(SocialActionTypes.ADD_SUBSCRIBER);
        expect(action.payload.subscription).toEqual(obj);
    });
});

describe('AddSubscriber for logged in user', () => {
    it('should create an action', async () => {
        const user: User = { ...TEST_DATA.userList[0] };
        const obj = new Subscription();
        obj.email = user.email;
        obj.userId = user.userId;
        const action = new AddSubscriber({ subscription: obj });
        expect(action.type).toEqual(SocialActionTypes.ADD_SUBSCRIBER);
        expect(action.payload.subscription).toEqual(obj);
    });
});

describe('AddSubscriberSuccess', async () => {
    it('should create an action', () => {
        const action = new AddSubscriberSuccess();
        expect(action.type).toEqual(SocialActionTypes.ADD_SUBSCRIBER_SUCCESS);
        expect(action.payload).toEqual(null);
    });
});

describe('GetTotalSubscriber', async () => {
    it('should create an action', () => {
        const action = new GetTotalSubscriber();
        expect(action.type).toEqual(SocialActionTypes.TOTAL_SUBSCRIBER);
        expect(action.payload).toEqual(null);
    });
});

describe('GetTotalSubscriberSuccess', async () => {
    it('should create an action', () => {
        const subscribers = new Subscribers();
        subscribers.count = 3;
        const action = new GetTotalSubscriberSuccess(subscribers);
        expect(action.type).toEqual(SocialActionTypes.TOTAL_SUBSCRIBER_SUCCESS);
        expect(action.payload).toEqual(subscribers);
    });
});

describe('LoadBlogs', async () => {
    it('should create an action', () => {
        const action = new LoadBlogs();
        expect(action.type).toEqual(SocialActionTypes.LOAD_BLOGS);
        expect(action.payload).toEqual(null);
    });
});

describe('LoadBlogsSuccess', async () => {
    it('should create an action', () => {
        const blog: Blog[] = TEST_DATA.blog;
        const action = new LoadBlogsSuccess(blog);
        expect(action.type).toEqual(SocialActionTypes.LOAD_BLOGS_SUCCESS);
        expect(action.payload).toEqual(blog);
    });
});