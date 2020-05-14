import { InviteFriendsDialogComponent } from './invite-friends-dialog.component';
import { AppState, appState } from '../../../../store';
import { User } from 'shared-library/shared/model';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatSnackBarModule } from '@angular/material';
import { Store } from '@ngrx/store';
import { Utils } from 'shared-library/core/services';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';

describe('InviteFriendsDialogComponent', () => {
    let component: InviteFriendsDialogComponent;
    let fixture: ComponentFixture<InviteFriendsDialogComponent>;
    let user: User;
    let spy: any;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InviteFriendsDialogComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: Utils
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ showSkip: 'false' })
                    }
                }
                ,
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {
                            }
                        }
                    ]
                })
            ],
            imports: [MatSnackBarModule]
        });
    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(InviteFriendsDialogComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        component = fixture.debugElement.componentInstance;
    });

    // Check created component
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Verify that user information should be set successfully', () => {
        user = { ...testData.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.user).toEqual(user);
    });

    it('Verify if the closeModel function works', async () => {
        component.ref = { close: function () { } };
        component.ref.close = jest.fn();
        component.closeModel();
        expect(component.ref.close).toHaveBeenCalledTimes(1);
    });

    it('navLinks should be empty when component is created', () => {
        expect(component.navLinks).toEqual([]);
    });

    it('Subscription should be empty when component is created', () => {
        expect(component.subscriptions).toEqual([]);
    });

    it('showSkipBtn should be undefined when component is created', () => {
        expect(component.showSkipBtn).toBe(undefined);
    });

    it('User should be undefined when component is created', () => {
        expect(component.user).toBe(undefined);
    });

    it('Verify different route params and check if the value is assigned properly', () => {
        fixture.detectChanges();
        expect(component.showSkipBtn).toEqual(false);
    });

    afterEach(() => {
        fixture.destroy();
    });
});
