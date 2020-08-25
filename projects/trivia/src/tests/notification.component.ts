import 'reflect-metadata';
import { NotificationComponent } from 'shared-library/shared/mobile/component/notification/notification.component';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { coreState, CoreState } from 'shared-library/core/store';
import { categoryDictionary, } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { User, Game } from 'shared-library/shared/model';
import { testData } from 'test/data';

describe('NotificationComponent', async () => {

    let component: NotificationComponent;
    let fixture: ComponentFixture<NotificationComponent>;
    let user: User;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([NotificationComponent], [
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
        fixture = await nsTestBedRender(NotificationComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on load component should set categoryDict', () => {
        categoryDictionary.setResult(testData.categoryDictionary);
        mockStore.refreshState();
        expect(component.categoryDict).toBe(testData.categoryDictionary);
    });

    it('on load component should set user', () => {
        user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
    });

    it('on load component should set notifications of games and friendInvitations', () => {
        const games = testData.games.map(dbModel => {
            return Game.getViewModel(dbModel);
        });
        const friendInvitations = [testData.invitation];
        mockCoreSelector.setResult({ gameInvites: games, friendInvitations });
        mockStore.refreshState();
        expect(component.notifications.length).toBe(25);
    });





});
