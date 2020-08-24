import 'reflect-metadata';
import { UpdateCategoryTagComponent } from 'shared-library/shared/mobile/component/update-category-tag/update-category-tag.component';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule, RouterExtensions } from 'nativescript-angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
// tslint:disable-next-line: max-line-length
import { coreState, CoreState, UserActions, CategoryActions, TagActions, ActionWithPayload } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { testData } from 'test/data';
import { Router } from '@angular/router';
import { Utils } from 'shared-library/core/services/utils';
import cloneDeep from 'lodash/cloneDeep';

describe('UpdateCategoryTagComponent', async () => {

    let component: UpdateCategoryTagComponent;
    let fixture: ComponentFixture<UpdateCategoryTagComponent>;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    let spy: any;
    let router: Router;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([UpdateCategoryTagComponent], [
        UserActions,
        CategoryActions,
        TagActions,
        {
            provide: Utils,
            useValue: {
                showMessage(type: string, message: string) { }
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
        fixture = await nsTestBedRender(UpdateCategoryTagComponent);
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

    it(`On load component should set categories when store emit categoryList and topCategories`, () => {
        const user = testData.userList[0];
        component.user = user;
        mockCoreSelector.setResult({ categories: cloneDeep(testData.categoryList), getTopCategories: cloneDeep(testData.topCategories) });
        mockStore.refreshState();
        expect(component.categories.length).toBe(9);

    });

    it(`On load component should set tags when store emit categoryList and getTopTags`, () => {
        const user = cloneDeep(testData.userList[0]);
        // tslint:disable-next-line: max-line-length
        mockCoreSelector.setResult({ user, categories: testData.categoryList, getTopCategories: testData.topCategories, getTopTags: testData.getTopTags });
        mockStore.refreshState();
        expect(component.tags).not.toBeNull()
    });

    it('on load component should set user', () => {
        const user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
    });

    it(`On selectTags it should select tag which index is passed`, () => {
        const user = cloneDeep(testData.userList[0]);
        component.user = user;
        // tslint:disable-next-line: max-line-length
        mockCoreSelector.setResult({ user, categories: testData.categoryList, getTopCategories: testData.topCategories, getTopTags: testData.getTopTags });
        mockStore.refreshState();
        component.selectTags(0);
        const expectedOutput = { 'key': 'java', 'doc_count': 80, 'requiredForGamePlay': true }
        expect(component.tags[0]).toEqual(expectedOutput);
    });

    it(`On updateCategoryTap it should dispatch action to update user profile and redirect to first question`, () => {
        const navigateSpy = spyOn(router, 'navigate');
        const user = cloneDeep(testData.userList[0]);
        component.user = user;
        const payload = { user: user, isLocationChanged: false };
        spy.and.callFake((action: ActionWithPayload<any>) => {
            expect(action.type).toEqual(UserActions.ADD_USER_PROFILE);
            expect(action.payload).toEqual(payload);
        });
        mockCoreSelector.setResult({ categories: testData.categoryList, getTopCategories: testData.topCategories });
        mockCoreSelector.setResult({ getTopTags: testData.getTopTags });
        mockStore.refreshState();
        component.updateCategoryTap();
        expect(spy).toHaveBeenCalled();
    });

    it(`On returnSelectedTagsOrCategories it should return selected tags`, () => {
        const user = cloneDeep(testData.userList[0]);
        component.user = user;
        component.categories = cloneDeep(testData.categoryList);
        const tags = cloneDeep(testData.getTopTags).map((tag, index) => {
            if (index % 2 === 0) {
                tag.requiredForGamePlay = true;
            } else {
                tag.requiredForGamePlay = false;
            }
            return tag;
        });
        component.tags = tags;
        component.tags[0].requiredForGamePlay = true;
        const selectedTag = component.returnSelectedTagsOrCategories(component.tags);
        const expectedResult = [
            { 'key': 'java', 'doc_count': 80, 'requiredForGamePlay': true },
            { 'key': 'base', 'doc_count': 60, 'requiredForGamePlay': true },
            { 'key': 'milan', 'doc_count': 29, 'requiredForGamePlay': true },
            { 'key': 'test', 'doc_count': 22, 'requiredForGamePlay': true },
            { 'key': 'net', 'doc_count': 19, 'requiredForGamePlay': true }
        ];
        expect(selectedTag).toEqual(expectedResult);
    });

    it(`On selectTopic it should set select category`, () => {
        const user = cloneDeep(testData.userList[0]);
        component.user = user;
        component.categories = cloneDeep(testData.categoryList);
        component.selectTopic(2);
        expect(component.selectedCategories).toBe(1);
    });

    it(`when store emit userProfileSaveStatus then it should show error message`, () => {

        const services = TestBed.get(Utils);
        const spyMessage = spyOn(services, 'showMessage');
        mockCoreSelector.setResult({ userProfileSaveStatus: 'SUCCESS' });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(spyMessage).toHaveBeenCalled();
    });

    it(`Verify on click back button should redirect to previous screen`, () => {
        const services = TestBed.get(RouterExtensions);
        const spyMessage = spyOn(services, 'back');
        component.back();
        expect(spyMessage).toHaveBeenCalled();
    });

});
