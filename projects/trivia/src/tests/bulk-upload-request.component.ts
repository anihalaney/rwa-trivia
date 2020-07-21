import 'reflect-metadata';
import { BulkUploadRequestComponent } from 'shared-library/shared/mobile/component/bulk-upload-request/bulk-upload-request.component';
import { Utils } from 'shared-library/core/services/utils';
import { Router } from '@angular/router';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { NavigationService } from 'shared-library/core/services/mobile';
import { testData } from 'test/data';
import { User, profileSettingsConstants } from 'shared-library/shared/model';

describe('BulkUploadRequestComponent', () => {

    let component: BulkUploadRequestComponent;
    let fixture: ComponentFixture<BulkUploadRequestComponent>;
    let spy: any;
    let router: Router;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([BulkUploadRequestComponent], [
        {
            provide: Utils,
            useValue: {
                showMessage(type: string, message: string) {
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
        UserActions,
        NavigationService
    ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]

    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(BulkUploadRequestComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        spy = spyOn(mockStore, 'dispatch');
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

        console.log(component.bulkUploadBtnText);
        expect(component.bulkUploadBtnText).toBe('Bulk Upload Request');
    });

    it(`It should set bulk upload btn text 'Bulk Upload Request'`, () => {
        const user = { ...testData.userList[0] };
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
        console.log(component.bulkUploadBtnText);
        expect(component.bulkUploadBtnText).toBe('Bulk Upload Request');
    });

    it(`It should set bulk upload btn text to be 'Send Request Again' when bulk request is pending`, () => {
        const user = { ...testData.userList[0] };
        user.bulkUploadPermissionStatus = profileSettingsConstants.PENDING;
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
        console.log(component.bulkUploadBtnText);
        expect(component.bulkUploadBtnText).toBe('Send Request Again');
    });

    it('call to navigateToUserAccount it should redirect user profile page', () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.navigateToUserAccount();
        const expectedQueryParam = { queryParams: { backUrl: '/user/my/questions/bulk-upload-request' } }
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/profile', ''], expectedQueryParam);
    });

    it('call to setBulkUploadRequest should show message to complete profile before request bulk upload', () => {
        component.user = { ...testData.userList[0] };
        const services = TestBed.get(Utils);
        const spyOnShowMessage = spyOn(services, 'showMessage').and.returnValue('');
        component.setBulkUploadRequest();
        expect(spyOnShowMessage).toHaveBeenCalledTimes(1);
    });

    it('call to setBulkUploadRequest should dispatch event to update user ', () => {
        const user: User = { ...testData.userList[0] };
        user.name = 'Jack';
        user.profilePicture = '/assets/images/default-avatar-small.png';
        component.user = user;
        const payload = { user: user, isLocationChanged: false };
        spy.and.callFake((action: ActionWithPayload<string>) => {
            expect(action.type).toEqual(UserActions.ADD_USER_PROFILE);
            expect(action.payload).toEqual(payload);
        });

        component.setBulkUploadRequest();
        expect(mockStore.dispatch).toHaveBeenCalled();

    });

});
