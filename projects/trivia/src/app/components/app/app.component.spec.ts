import { AppComponent } from './app.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { User } from 'shared-library/shared/model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, appState } from '../../store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { MatSnackBarModule } from '@angular/material';
import { Store, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { WindowRef } from 'shared-library/core/services';
import { UserActions, ApplicationSettingsActions, CategoryActions, TopicActions, UIStateActions, CoreState, coreState } from 'shared-library/core/store';
import { AuthenticationProvider, FirebaseAuthService } from 'shared-library/core/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import * as gamePlayActions from '../../game-play/store/actions';
import { Renderer2, Type } from '@angular/core';
import { Observable, of } from 'rxjs';

class MockRouter {
    url = 'dashboard';
    public ne = new NavigationEnd(1, '/dashboard', '/dashboard');
    public events = new Observable(observer => {
        observer.next(this.ne);
        observer.complete();
    });
    navigate(commands: any[], extras?) {
        return;
    }
}

describe('AppComponent', () => {
    window.scrollTo = jest.fn();
    let renderer2: Renderer2;
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let spy: any;
    let navigateSpy: any;
    let user: User;
    // let router: Router;
    let mockStore: MockStore<AppState>;
    const firebaseAuthService: FirebaseAuthService = null;
    const store: Store<CoreState> = null;
    const firebaseAuthState = () => {
        firebaseAuthService.authState().subscribe(afUser => {
            if (afUser) {
                firebaseAuthService.getIdToken(afUser, false).then((token) => {
                    user = new User(afUser);
                    user.idToken = token;
                    store.dispatch(this.userActions.loginSuccess(this.user));
                });
            } else {
                // user not logged in
                store.dispatch(this.userActions.logoff());
            }
        });
    };
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                WindowRef,
                UserActions,
                ApplicationSettingsActions,
                CategoryActions,
                TopicActions,
                Renderer2,
                {
                    provide: AuthenticationProvider,
                    useValue: {
                        firebaseAuthState,
                        updateUserConnection() {
                        },
                        ensureLogin() {
                            return true;
                        }
                    }
                },
                UIStateActions,
                FirebaseAuthService,
                { provide: Router, useClass: MockRouter },
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {}
                        }
                    ]
                })
            ],
            imports: [MatSnackBarModule, RouterTestingModule.withRoutes([])]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(AppComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        fixture = TestBed.createComponent(AppComponent);
        // grab the renderer
        renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        component = fixture.debugElement.componentInstance;
        // router = TestBed.get(Router);
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('User initial value should be undefined', () => {
        expect(component.user).toEqual(undefined);
    });

    it('On load component should set user', () => {
        user = { ...testData.userList[0] };
        user.authState = { uid: user.userId } as any;
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.user).toEqual(user);
    });

    it('On load component should dispatch makeFriend action and also it should call updateUserConnection function', () => {
        user = { ...testData.userList[0] };
        user.authState = { uid: user.userId } as any;
        spyOn(component.authService, 'updateUserConnection').and.callThrough();
        const invitationTokenStatus = testData.invitation.status;
        mockCoreSelector.setResult({ user, invitationToken: invitationTokenStatus });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledWith(
            new UserActions().makeFriend({ token: invitationTokenStatus, email: user.email, userId: user.authState.uid })
        );

        expect(component.authService.updateUserConnection).toHaveBeenCalled();
    });

    it('Verfy loginRedirectUrl on load component it should call router.navigate()', () => {
        navigateSpy = spyOn(component.router, 'navigate');
        user = { ...testData.userList[0] };
        user.authState = { uid: user.userId } as any;
        spyOn(component.authService, 'updateUserConnection').and.callThrough();
        const invitationTokenStatus = testData.invitation.status;
        mockCoreSelector.setResult({ user, invitationToken: invitationTokenStatus, loginRedirectUrl: '/game-play/game-options/Single' });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(navigateSpy).toHaveBeenCalled();
    });

    it(`On load component verify newGameId when user start new game.
     it should call router.navigate function and dispatch ResetCurrentQuestion action`, () => {
        navigateSpy = spyOn(component.router, 'navigate');
        user = { ...testData.userList[0] };
        user.authState = { uid: user.userId } as any;
        spyOn(component.authService, 'updateUserConnection').and.callThrough();
        const invitationTokenStatus = testData.invitation.status;
        const gameObj: any = { 'gameId': 'bU6dx77AUXtQRVMjt8tb' };
        mockCoreSelector.setResult({ user, invitationToken: invitationTokenStatus, newGameId: gameObj });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(navigateSpy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(
            new gamePlayActions.ResetCurrentQuestion()
        );
    });

    it(`On load component verify userProfileSaveStatus when status equal to 'MAKE FRIEND SUCCESS' then
    it should call router.navigate function and snackBar.open function`, () => {
        navigateSpy = spyOn(component.router, 'navigate');
        component.snackBar.open = jest.fn();
        user = { ...testData.userList[0] };
        user.authState = { uid: user.userId } as any;
        spyOn(component.authService, 'updateUserConnection').and.callThrough();
        const invitationTokenStatus = testData.invitation.status;
        mockCoreSelector.setResult({ user, invitationToken: invitationTokenStatus });
        mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {
            userProfileSaveStatus: 'MAKE FRIEND SUCCESS'
        });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(navigateSpy).toHaveBeenCalled();
        expect(component.snackBar.open).toHaveBeenCalled();
    });

    it('call to login function it should call ensureLogin function', () => {
        const spyAuthService = spyOn(component.authService, 'ensureLogin').and.callThrough();
        expect(spyAuthService);
        component.login();

        expect(component.authService.ensureLogin).toHaveBeenCalled();
    });

    it('call to logout function it should call authService.logout function and also call router.navigate', () => {
        navigateSpy = spyOn(component.router, 'navigate');
        component.authService.logout = jest.fn();
        component.logout();

        expect(component.authService.logout).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalled();
    });

    it('Set dark theme using toggleTheme function, it should call render.addClass function', () => {
        const renderSpy = spyOn(renderer2, 'addClass').and.callThrough();
        component.toggleTheme();

        expect(renderSpy).toHaveBeenCalled();
    });

    it('Set normal theme using toggleTheme function, it should call render.removeClass function', () => {
        const renderSpy = spyOn(renderer2, 'removeClass').and.callThrough();
        component.theme = 'dark';
        component.toggleTheme();

        expect(renderSpy).toHaveBeenCalled();
    });

    it('Verify cookiesAccepted function it should call cookieLawEl.dismiss function', () => {
        component.cookieLawEl.dismiss = jest.fn();
        component.cookiesAccepted();

        expect(component.cookieLawEl.dismiss).toHaveBeenCalled();
    });

    it('On load component should dispatch loadApplicationSettings, loadCategories and loadTopTopics action', () => {
        expect(spy).toHaveBeenCalledWith(
            new ApplicationSettingsActions().loadApplicationSettings()
        );
        expect(spy).toHaveBeenCalledWith(
            new CategoryActions().loadCategories()
        );
        expect(spy).toHaveBeenCalledWith(
            new TopicActions().loadTopTopics()
        );
    });

    it('On load component call router.navigate function when there is no user', () => {
        navigateSpy = spyOn(component.router, 'navigate');
        user = null;
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(navigateSpy).toHaveBeenCalled();
    });

    it('On load component should call windowRef.addNavigationsInAnalytics function and windowRef.scrollDown function', () => {
        const routerEventSpy = spyOn(component.router, 'events').and
        .returnValue(of(new NavigationEnd(1, '/dashboard', '/dashboard')));
        routerEventSpy.and.returnValue(MockRouter);
        user = { ...testData.userList[0] };
        user.authState = { uid: user.userId } as any;
        mockCoreSelector.setResult({ user });
        component.windowRef.addNavigationsInAnalytics = jest.fn();
        component.windowRef.scrollDown = jest.fn();
        mockStore.refreshState();
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.windowRef.addNavigationsInAnalytics).toHaveBeenCalled();
        expect(component.windowRef.scrollDown).toHaveBeenCalled();
    });

    it('On load component verify intervalSubscription', (async () => {
        component.authService.updateUserConnection = jest.fn();
        user = { ...testData.userList[0] };
        user.authState = { uid: user.userId } as any;
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        fixture.detectChanges();
        jest.setTimeout(60000);
        await new Promise((r) => setInterval(r, 60000));

        expect(component.authService.updateUserConnection).toHaveBeenCalled();
    }));
});
