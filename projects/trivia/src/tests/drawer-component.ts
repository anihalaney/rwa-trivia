import 'reflect-metadata';
import { DrawerComponent } from 'shared-library/shared/mobile/component/drawer-component/drawer-component';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { coreState, CoreState, UserActions, UIStateActions, TopicActions, ApplicationSettingsActions, ActionWithPayload } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthenticationProvider, FirebaseAuthService } from 'shared-library/core/auth';
import { User, Topic, DrawerConstants } from 'shared-library/shared/model';
import { testData } from 'test/data';
import { RouterExtensions } from 'nativescript-angular/router';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import cloneDeep from 'lodash/cloneDeep';
describe('DrawerComponent', async () => {

    let component: DrawerComponent;
    let fixture: ComponentFixture<DrawerComponent>;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const applicationSettings: any[] = [];
    let spy: any;
    let spyOnSideBar: any;
    let router: Router;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([DrawerComponent], [
        {
            provide: Utils,
            useValue: {
                showMessage(type: string, message: string) { },
                getImageUrl(user: User, width: Number, height: Number, size: string) {
                    if (user && user !== null && user.profilePicture && user.profilePicture !== '') {
                        if (this.sanitizer) {
                            return this.sanitizer.bypassSecurityTrustUrl(
                                `https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/user/profile/
                                ${user.userId}/${user.profilePicture}//${width}/${height}`
                            );
                        } else {
                            return `https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/user/profile/
                            ${user.userId}/${user.profilePicture}//${width}/${height}`;
                        }
                    } else {
                        return `~/assets/images/avatar-${size}.png`;
                    }
                }
            }
        },
        FormBuilder,
        UserActions,
        TopicActions,
        UIStateActions,
        ApplicationSettingsActions,
        {
            provide: FirebaseAuthService,
            useValue: {

                authState() {
                    return of();
                }
            }
        },
        {
            provide: AuthenticationProvider,
            useValue: {
                updatePassword() {
                    return '';
                },
                logout() {
                    return '';
                },
                updateUserConnection() {
                    return '';
                }
            }
        },
        provideMockStore({
            initialState: {},
            selectors: [
                {
                    selector: coreState,
                    value: {}
                }
            ]
        }),
    ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(DrawerComponent);
        component = fixture.componentInstance;
        spyOnSideBar = spyOn(component, 'sideDrawer').and.returnValue({
            closeDrawer: () => { },
            getIsOpen: () => { 'dfds'; }
        });

        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        fixture.detectChanges();

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on call closeDrawer it should call sideDrawer and set loader false', () => {
        component.closeDrawer();
        expect(spyOnSideBar).toHaveBeenCalled();
        expect(component.loader).toBeFalsy();
    });

    it('on call dashboard it should redirect dashboard page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.dashboard();
        expect(spyOnSideBar).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith(['/dashboard'], { clearHistory: true });
    });

    it('on call dashboard it should redirect login page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.login();
        expect(spyOnSideBar).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith(['/login'], { clearHistory: true });
    });

    it('on call logout it should logout and reset the state', () => {
        const spyOnResetValues = spyOn(component, 'resetValues');
        component.user = testData.userList[0];
        component.logout();
        expect(spyOnResetValues).toHaveBeenCalledTimes(1);
    });

    it('on call logout it should logout and update the user status', () => {

        const spyOnUpdateUser = spyOn(component, 'updateUser');
        const user = testData.userList[0];
        component.pushToken = user.iosPushTokens[0].token;
        component.user = user;
        component.logout();
        expect(spyOnUpdateUser).toHaveBeenCalledTimes(1);

    });

    it('on call resetValues it should logout user and reset the all the state', () => {

        const services = TestBed.get(AuthenticationProvider);
        const spyOnLogout = spyOn(services, 'logout').and.returnValue('');

        const spyCloseDrawer = spyOn(component, 'closeDrawer');

        component.resetValues();

        spy.and.callFake((action: ActionWithPayload<Topic[]>) => {
            expect(action.type).toEqual(TopicActions.LOAD_TOP_TOPICS);
            expect(action.payload).toEqual(null);
        });
        spy.and.callFake((action: ActionWithPayload<null>) => {
            expect(action.type).toEqual(ApplicationSettingsActions.LOAD_APPLICATION_SETTINGS);
            expect(action.payload).toEqual(null);
        });

        expect(component.logOut).toBeFalsy();
        expect(component.pushToken).toBeUndefined();
        expect(component.activeMenu).toBe('Home');
        expect(spyCloseDrawer).toHaveBeenCalledTimes(1);
        expect(spyOnLogout).toHaveBeenCalledTimes(1);
        expect(mockStore.dispatch).toHaveBeenCalledTimes(2);
    });


    it('on call updateUser it should dispatch updateUser action', () => {
        const user = testData.userList[0];
        const payload = { user, status: DrawerConstants.UPDATE_TOKEN_STATUS };
        spy.and.callFake((action: ActionWithPayload<null>) => {
            expect(action.type).toEqual(UserActions.UPDATE_USER);
            expect(action.payload).toEqual(payload);
        });
        component.updateUser(user, DrawerConstants.UPDATE_TOKEN_STATUS);
    });

    it('on call navigateToRecentGames it should redirect recent-games page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToRecentGames();
        expect(navigateSpy).toHaveBeenCalledWith(['/recent-games'], undefined);
    });

    it('on call navigateToProfileSettings it should redirect profile page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.user = testData.userList[0];
        component.navigateToProfileSettings();
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/profile', '4kFa6HRvP5OhvYXsH9mEsRrXj4o2'], undefined);
    });


    it('on call navigateToMyQuestion it should redirect questions page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToMyQuestion();
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/questions'], undefined);
    });

    it('verify set categories list after value is emitted', () => {
        mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {
            categories: testData.categoryList
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.categories).toEqual(testData.categoryList);
    });

    it('verify if application settings is set after the value is emitted ', () => {
        // tslint:disable-next-line: no-shadowed-variable
        const applicationSettings = [];
        applicationSettings.push(cloneDeep(testData.applicationSettings));
        mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {
            applicationSettings: applicationSettings
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.applicationSettings).toEqual(applicationSettings[0]);
    });


    it('verify if userUpdateStatus is set after the value is emitted and reset the all details', () => {
        const spyOnResetValues = spyOn(component, 'resetValues');
        mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {
            userUpdateStatus: DrawerConstants.LOGOUT
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(spyOnResetValues).toHaveBeenCalledTimes(1);
    });

    it('verify if userUpdateStatus is set after the value is emitted and update status of user connection', () => {
        const services = TestBed.get(AuthenticationProvider);
        const spyOnUpdateUserConnection = spyOn(services, 'updateUserConnection').and.returnValue('');
        mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {
            userUpdateStatus: DrawerConstants.UPDATE_TOKEN_STATUS
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(spyOnUpdateUserConnection).toHaveBeenCalledTimes(1);
    });


    it('verify if userUpdateStatus is set after the value is emitted and update status of user connection', () => {
        
        const iosToken = ''
        spyOn(component, 'firebaseToken').and.returnValue('abcd');

        const user = testData.userList[0];
        mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {
            user
        });
        mockStore.refreshState();
        fixture.detectChanges();
        // expect(spyOnUpdateUserConnection).toHaveBeenCalledTimes(1);
    });



});
