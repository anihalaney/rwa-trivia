import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { InvitationRedirectionComponent } from './invitation-redirection.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../store';
import { testData } from 'test/data';
import { CoreState } from 'shared-library/core/store';
import { MatSnackBarModule } from '@angular/material';
import { UserActions } from 'shared-library/core/store/actions';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';


describe('InvitationRedirectionComponent', () => {

    let component: InvitationRedirectionComponent;
    let fixture: ComponentFixture<InvitationRedirectionComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InvitationRedirectionComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: Router,
                    useValue: {
                      url: '/invitation-redirect',
                      navigate: (url) => {
                      }
                    }
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ token: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1' })
                    }
                },
                UserActions,
                provideMockStore( {
                    initialState: {},
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {}
                          },
                          {
                            selector: appState.dashboardState,
                            value: {}
                          }
                    ]
                  })
            ],
            imports: [ MatSnackBarModule ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(InvitationRedirectionComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        component = fixture.debugElement.componentInstance;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('verify if the user value is set after the value is emitted', () => {

        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
          });
          mockStore.refreshState();
          expect(component.user).toEqual(testData.userList[0]);
    });

    it('verify if the storeInvitationToken, makeFriend events are emitted', () => {
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: testData.userList[0]
        });
        mockStore.refreshState();
        component.user.authState = { uid: testData.userList[0].userId} as any;
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledWith(new UserActions().storeInvitationToken('yP7sLu5TmYRUO9YT4tWrYLAqxSz1'));
        expect(spy).toHaveBeenCalledWith(new UserActions().makeFriend({
            token: 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1',
            email: testData.userList[0].email,
            userId: testData.userList[0].userId
        }));
    });


    it('verify navigate to dashboard if user is not set', () => {
       const navigateSpy = spyOn(component.router, 'navigate');
       fixture.detectChanges();
       expect(navigateSpy).toHaveBeenCalledTimes(1);
       expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
    });

    afterEach(() => {
        fixture.destroy();
    });

});
