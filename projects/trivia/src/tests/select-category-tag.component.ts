import 'reflect-metadata';
import { SelectCategoryTagComponent } from 'shared-library/shared/mobile/component/select-category-tag/select-category-tag.component';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
// tslint:disable-next-line: max-line-length
import { coreState, CoreState, UserActions, CategoryActions, TagActions, ActionWithPayload } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { testData } from 'test/data';
import { Router } from '@angular/router';
describe('SelectCategoryTagComponent', async () => {

    let component: SelectCategoryTagComponent;
    let fixture: ComponentFixture<SelectCategoryTagComponent>;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    let spy: any;
    let router: Router;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([SelectCategoryTagComponent], [
        UserActions,
        CategoryActions,
        TagActions,
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
        fixture = await nsTestBedRender(SelectCategoryTagComponent);
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
        mockCoreSelector.setResult({ categories: testData.categoryList, getTopCategories: testData.topCategories });
        mockStore.refreshState();
        const expectedOutput = [
            { 'id': 1, 'categoryName': 'Bit of sci-fi', 'requiredForGamePlay': false },
            { 'id': 2, 'categoryName': 'Programming', 'requiredForGamePlay': false },
            { 'id': 3, 'categoryName': 'Architecture', 'requiredForGamePlay': false },
            { 'id': 4, 'categoryName': 'Networking/Infrastructure', 'requiredForGamePlay': false },
            { 'id': 5, 'categoryName': 'Database', 'requiredForGamePlay': false },
            { 'id': 6, 'categoryName': 'Dev Ops', 'requiredForGamePlay': false },
            { 'id': 7, 'categoryName': 'UX/UI', 'requiredForGamePlay': false },
            { 'id': 8, 'categoryName': 'Bit of fact', 'requiredForGamePlay': false },
            { 'id': 9, 'categoryName': 'Hardware', 'requiredForGamePlay': false }
        ];
        expect(component.categories).toEqual(expectedOutput);
    });
    it(`On load component should set tags when store emit categoryList and getTopTags`, () => {
        mockCoreSelector.setResult({ getTopTags: testData.getTopTags });
        mockStore.refreshState();
        expect(component.tags.length).toBe(10);
    });

    it('on load component should set user', () => {
        const user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
    });

    it(`On selectTags it should select tag which index is passed`, () => {
        mockCoreSelector.setResult({ getTopTags: testData.getTopTags });
        mockStore.refreshState();
        component.selectTags(0);

        expect(component.selectedTags).toBe(1);
    });
    it(`On continueToFirstQuestion it should dispatch action to update user profile and redirect to first question`, () => {
        const navigateSpy = spyOn(router, 'navigate');
        const user = testData.userList[0];
        const payload = { user: user, isLocationChanged: false };
        spy.and.callFake((action: ActionWithPayload<any>) => {
            expect(action.type).toEqual(UserActions.ADD_USER_PROFILE);
            expect(action.payload).toEqual(payload);
        });

        mockCoreSelector.setResult({ categories: testData.categoryList, getTopCategories: testData.topCategories });
        mockCoreSelector.setResult({ getTopTags: testData.getTopTags });
        mockStore.refreshState();
        component.user = user;
        component.continueToFirstQuestion();
        expect(navigateSpy).toHaveBeenCalledWith(['/first-question'], { clearHistory: true });
        expect(spy).toHaveBeenCalled();
    });

    it(`On returnSelectedTagsOrCategories it should return selected tags`, () => {

        const user = testData.userList[0];
        const payload = { user: user, isLocationChanged: false };
        spy.and.callFake((action: ActionWithPayload<any>) => {
            expect(action.type).toEqual(UserActions.ADD_USER_PROFILE);
            expect(action.payload).toEqual(payload);
        });

        mockCoreSelector.setResult({ categories: testData.categoryList, getTopCategories: testData.topCategories });
        mockCoreSelector.setResult({ getTopTags: testData.getTopTags });
        mockStore.refreshState();
        component.user = user;
        component.tags[0].requiredForGamePlay = true;
        const selectedTag = component.returnSelectedTagsOrCategories(component.tags);
        const expectedResult = [{ 'key': 'java', 'doc_count': 80, 'requiredForGamePlay': true }];
        expect(selectedTag).toEqual(expectedResult);

    });

});