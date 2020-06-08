import { User, Question, UserStatus } from 'shared-library/shared/model';
import * as UserActions from './user.actions';
import { testData } from 'test/data';


describe('LoadUserPublishedQuestions', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new UserActions.LoadUserPublishedQuestions({user: user});
        expect(action.type).toEqual(UserActions.UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS);
        expect(action.payload).toEqual({user: user});
    });
});


describe('LoadUserPublishedQuestionsSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions.LoadUserPublishedQuestionsSuccess([testData.questions.published[0]]);
        expect(action.type).toEqual(UserActions.UserActionTypes.LOAD_USER_PUBLISHED_QUESTIONS_SUCCESS);
        expect(action.payload).toEqual([testData.questions.published[0]]);
    });
});


describe('LoadUserUnpublishedQuestions', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new UserActions.LoadUserUnpublishedQuestions({user : user});
        expect(action.type).toEqual(UserActions.UserActionTypes.LOAD_USER_UNPUBLISHED_QUESTIONS);
        expect(action.payload).toEqual({user : user});
    });
});


describe('LoadUserUnpublishedQuestionsSuccess', () => {
    it('should create an action', () => {
        const user: User = testData.userList[0];
        const action = new UserActions.LoadUserUnpublishedQuestionsSuccess([testData.questions.unpublished[0]]);
        expect(action.type).toEqual(UserActions.UserActionTypes.LOAD_USER_UNPUBLISHED_QUESTIONS_SUCCESS);
        expect(action.payload).toEqual([testData.questions.unpublished[0]]);
    });
});


describe('AddQuestion', () => {
    it('should create an action', () => {
        const action = new UserActions.AddQuestion({question: testData.questions.published[0]});
        expect(action.type).toEqual(UserActions.UserActionTypes.ADD_QUESTION);
        expect(action.payload).toEqual({question: testData.questions.published[0]});
    });
});

describe('UpdateUserSuccess', () => {
    it('should create an action', () => {
        const action = new UserActions.UpdateUserSuccess(testData.userList[0]);
        expect(action.type).toEqual(UserActions.UserActionTypes.UPDATE_USER_SUCCESS);
        expect(action.payload).toEqual(testData.userList[0]);
    });
});
