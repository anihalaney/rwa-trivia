import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { GameContinueComponent } from './../app/game-play/components/game-continue/game-continue.component.tns';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState } from 'shared-library/core/store';
import { testData } from 'test/data';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User, Game } from 'shared-library/shared/model';
import { AppState, appState } from './../app/store';
import { Router } from '@angular/router';
import { UserActions } from 'shared-library/core/store/actions';
import { Utils } from 'shared-library/core/services';

describe('GameContinueComponent', () => {
    let component: GameContinueComponent;
    let fixture: ComponentFixture<GameContinueComponent>;
    let user: User;
    let router: Router;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;

    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach(
        [GameContinueComponent],
        [UserActions,
            Utils,
            provideMockStore({
                initialState: {},
                selectors: [
                    {
                        selector: appState.coreState,
                        value: {
                        }
                    }
                ]
            }),
        ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    beforeEach((async () => {
        fixture = await nsTestBedRender(GameContinueComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('User should be set value is emitted', () => {
        user = { ...testData.userList[0] };
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user
        });
        mockStore.refreshState();
        expect(component.user).toBe(user);
    });

    it('Other user info should be set in ngOnInit', () => {
        const dbModel = testData.games[1];
        user = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': testData.userList[0], 'yP7sLu5TmYRUO9YT4tWrYLAqxSz1': testData.userList[1] };
        component.game = Game.getViewModel(dbModel);
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.otherUserId).toBe('yP7sLu5TmYRUO9YT4tWrYLAqxSz1');
        expect(component.otherUserInfo).toEqual(testData.userList[1]);
    });

    it('continueClicked() function should emit continueButtonClicked event', () => {
        spyOn(component.continueButtonClicked, 'emit');
        component.continueClicked();
        expect(component.continueButtonClicked.emit).toHaveBeenCalledTimes(1);
    });

    it(`it should redirect dashboard on click on gotoDashboard`, () => {
        const navigate = spyOn(component.routerExtensions, 'navigate');
        component.gotoDashboard();
        expect(navigate).toHaveBeenCalledWith(['/dashboard'], { clearHistory: true });
    });
    it('On ngOnDestroy called  it should call destroy', () => {
        const spyOnDestroy = spyOn(component, 'destroy').and.returnValue('');
        component.ngOnDestroy();
        expect(spyOnDestroy).toHaveBeenCalledTimes(1);
    });

});
