import 'reflect-metadata';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';
import { GameComponent } from './../app/game-play/components/game/game.component.tns';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { CoreState } from 'shared-library/core/store';
import { testData } from 'test/data';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User } from 'shared-library/shared/model';
import { AppState, appState } from './../app/store';
import { Router } from '@angular/router';



describe('GameComponent', () => {
    let component: GameComponent;
    let fixture: ComponentFixture<GameComponent>;
    let user: User = { ...testData.userList[1] };
    let router: Router;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;

    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach(
        [GameComponent],
        [
            provideMockStore({
                initialState: {},
                selectors: [
                    {
                        selector: appState.coreState,
                        value: {
                            user
                        }
                    }
                ]
            }),
        ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    beforeEach((async () => {
        fixture = await nsTestBedRender(GameComponent);
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

    it(`on ngOnInit call timeout should not be null`, () => {
        component.ngOnInit();
        expect(component.timeout).not.toBeNull();
    });

    it(`on ngOnInit call it should set displayQuestion to true`, fakeAsync(() => {
        component.ngOnInit();
        expect(component.timeout).not.toBeNull();
        tick(0);
        expect(component.displayQuestion).toBeTruthy();
    }));

    it('on load component it should set page actionBar Hidden to true', () => {

        expect(component.page.actionBarHidden).toBeTruthy();
    });

    it('on ngOnDestroy call renderview should be set false', () => {

        component.ngOnDestroy();
        expect(component.renderView).toBeFalsy();
    });

    it('On load component should set userDict and user when emit from store', () => {

        user = { ...testData.userList[1] };
        const userDict = testData.userDict;
        // mock data
        mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {
            user: user,
            userDict: userDict
        });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.userDict).toEqual(userDict);
        expect(component.user).toEqual(user);
    });







});
