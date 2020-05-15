import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Store, MemoizedSelector } from '@ngrx/store';
import { UserActions, CoreState } from 'shared-library/core/store';
import { InviteFriendsComponent } from './invite-friends.component';
import { CdkColumnDef, CdkRowDef, CdkHeaderRowDef } from '@angular/cdk/table';
import { PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material';
import { testData } from 'test/data';

describe('InviteFriendsComponent', () => {
    let component: InviteFriendsComponent;
    let fixture: ComponentFixture<InviteFriendsComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InviteFriendsComponent, CdkColumnDef, CdkRowDef, CdkHeaderRowDef],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                UserActions,
                {
                    provide: MatDialog,
                    useValue: {}
                },
                { provide: PLATFORM_ID, useValue: 'browser' },
                provideMockStore({
                    initialState: {},
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {
                            }
                        }
                    ]
                })
            ],
            imports: [ ]
        });
    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(InviteFriendsComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        component = fixture.debugElement.componentInstance;
    });

    // Check created component
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`uFriends and user Dictionary, dataSource should be empty, displayedColumns should be initialized,
        defaultAvatar should be set from assets image initially`, () => {
        expect(component.uFriends).toEqual(undefined);
        expect(component.dataSource).toEqual(undefined);
        expect(component.defaultAvatar).toEqual('assets/images/default-avatar.png');
        expect(component.displayedColumns).toEqual(['friends', 'game_played', 'won', 'lost']);
    });


    it('loadUserFriends action should be fired after the user data is set', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        mockStore.refreshState();
        expect(mockStore.dispatch).toHaveBeenCalledWith(
            new UserActions().loadUserFriends(testData.userList[0].userId)
        );
        expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
    });

    it('userFriends list should be set after the value is emitted', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            userFriends: testData.friendsList
        });
        mockStore.refreshState();
        expect(component.uFriends).toEqual(testData.friendsList);
    });

    it('setPaginatorAndSort should be called after the friend list value is emitted', () => {
        component.setPaginatorAndSort = jest.fn();
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            userFriends: testData.friendsList
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.setPaginatorAndSort).toHaveBeenCalledTimes(1);
    });

    it('setPaginatorAndSort should work correctly', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            userFriends: testData.friendsList
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.setPaginatorAndSort();
        expect(component.dataSource.paginator).toEqual(component.paginator);
    });

    it('inviteMoreFriend should work correctly', (async () => {
        component.openDialog = jest.fn();
        component.inviteMoreFriend();
        await new Promise((r) => setTimeout(r, 0));
        expect(component.openDialog).toHaveBeenCalledTimes(1);
    }));

    it('openDialog should work correctly', () => {
        // to do add test case for click event of dialog and check if the intended css class is added. same as for close dialog event.
    });


});
