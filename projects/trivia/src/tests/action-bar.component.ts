import 'reflect-metadata';
import { ActionBarComponent } from 'shared-library/shared/mobile/component/action-bar/action-bar.component';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { NavigationService } from 'shared-library/core/services/mobile';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { User } from 'shared-library/shared/model';
import { testData } from 'test/data';

describe('ActionBarComponent', () => {

    let component: ActionBarComponent;
    let fixture: ComponentFixture<ActionBarComponent>;
    let router: Router;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([ActionBarComponent], [
        {
            provide: Utils,
            useValue: {
                getImageUrl(user: User, width: Number, height: Number, size: string) {
                    // tslint:disable-next-line: max-line-length
                    return 'https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/user/profile/tej7Au4YjrM5c5uHx06LT5fIRuF2/1566395936403.jpg/44/40';
                },
                back() {
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
        NavigationService,
    ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(ActionBarComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        router = TestBed.get(Router);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on load component should set user', () => {
        const user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
        // tslint:disable-next-line: max-line-length
        expect(component.photoUrl).toBe('https://rwa-trivia-dev-e57fc.firebaseapp.com/v1/user/profile/tej7Au4YjrM5c5uHx06LT5fIRuF2/1566395936403.jpg/44/40');
    });

    it('call to back should emit isBackPress event', () => {
        component.emitBackEvent = true;
        spyOn(component.isBackPress, 'emit');
        component.back();
        expect(component.isBackPress.emit).toHaveBeenCalledWith(true);
    });
    it('call to back should it should navigate to back screen', () => {
        component.emitBackEvent = false;
        const navigationService = TestBed.get(NavigationService);
        const spyNavigationService = spyOn(navigationService, 'back');

        component.back();
        expect(spyNavigationService).toHaveBeenCalled();
    });

    it('call to navigateToBulkUpload it should redirect to build upload request page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToBulkUpload();
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/questions/bulk-upload-request'], undefined);
    });

    it('call to goToDashboard it should redirect to dashboard', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.goToDashboard();
        expect(navigateSpy).toHaveBeenCalledWith(['/dashboard'], { clearHistory: true });
    });

    it('call to navigateToSubmitQuestion it should redirect to add question page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToSubmitQuestion();
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/questions/add'], undefined);
    });

    it('call to navigateToMyQuestion it should redirect to my question page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToMyQuestion();
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/questions'], undefined);
    });

    it('call to navigateToInvite it should redirect to my invite friend page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToInvite();
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/app-invite-friends-dialog', { showSkip: false }], undefined);
    });

    it('call to navigateToProfile it should redirect to profile page', () => {
        component.showEdit = {
            showEditOrOptions: 'edit',
            routing: '/my/profile',
            userId: 'dDEsdehYsGysrFSrF'
        };

        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToProfile();
        expect(navigateSpy).toHaveBeenCalledWith(['/my/profile', 'dDEsdehYsGysrFSrF'], undefined);
    });

    it('call to navigateToProfile it should redirect to profile page', () => {
        spyOn(component.open, 'emit');
        const spyOnOpenSidebar = spyOn(component, 'openSideDrawer').and.returnValue('');
        component.openSidebar();
        expect(component.open.emit).toHaveBeenCalledWith();
    });
});
