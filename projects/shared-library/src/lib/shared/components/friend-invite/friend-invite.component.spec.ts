import { FriendInviteComponent } from './friend-invite.component';
import { friendInvitationConstants } from 'shared-library/shared/model';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';
import { UserActions, ActionWithPayload } from '../../../core/store';

describe('FriendInviteComponent', () => {
  let component: FriendInviteComponent;
  let fixture: ComponentFixture<FriendInviteComponent>;
  let spy: any;
  let mockStore: MockStore<CoreState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FriendInviteComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
        }),
        UserActions
      ]
    });
  }));

  beforeEach(() => {
    // create component
    fixture = TestBed.createComponent(FriendInviteComponent);
    // mock data
    mockStore = TestBed.get(Store);
    spy = spyOn(mockStore, 'dispatch');
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  // Check created component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Initial value of the invitation and user should be falsy and userCardType should be truthy', () => {
    expect(component.invitation).toBeFalsy();
    expect(component.user).toBeFalsy();
    expect(component.userCardType).toBeTruthy();
  });

  it('call to acceptFriendInvitation it should dispatch make friend action', () => {

    const user = testData.userList[0];
    const invitation = testData.invitation;

    component.user = user;
    component.invitation = invitation;

    const payload = {
      token: invitation.id,
      email: user.email,
      userId: user.userId
    };

    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(UserActions.MAKE_FRIEND);
      expect(action.payload).toEqual(payload);
    });

    component.acceptFriendInvitation();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });



  it('call to otherInfo it should return object with notificationText and notificationText ', () => {
    const invitation = testData.invitation;
    component.invitation = invitation;

    const otherInfo = component.otherInfo();

    expect(otherInfo).toEqual({
      invitationStatus: 'pending',
      notificationText: 'sent you a Friend Request'
    });

  });

  it('call to rejectFriendInvitation it should dispatch update Invitation action', () => {

    const user = testData.userList[0];
    const invitation = testData.invitation;
    invitation.status = friendInvitationConstants.REJECTED;

    component.user = user;
    component.invitation = invitation;

    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(UserActions.UPDATE_INVITATION);
      expect(action.payload).toEqual(invitation);
    });

    component.rejectFriendInvitation();
    expect(mockStore.dispatch).toHaveBeenCalled();

  });

});
