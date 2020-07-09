import 'reflect-metadata';
import { GameOverComponent } from '../app/game-play/components/game-over/game-over.component.tns';
import { Utils, WindowRef } from 'shared-library/core/services';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed, tick, fakeAsync, discardPeriodicTasks } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Router } from '@angular/router';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState, appState } from './../app/store';
import { testData } from 'test/data';
import { coreState, CoreState, UserActions } from 'shared-library/core/store';
import { User } from 'shared-library/sharGameOverComponented/model';
import { gamePlayState, GamePlayState } from '../app/game-play/store';

describe('GameOverComponent', () => {

    let component: GameOverComponent;
    let fixture: ComponentFixture<GameOverComponent>;
    let mockStore: MockStore<AppState>;
    let spy: any;
    let router: Router;
    let user: User;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([GameOverComponent], [
        UserActions,
        WindowRef,

        {
            provide: Utils,
            useValue: {
                getImageUrl(user: User, width: Number, height: Number, size: string) {
                    return `~/assets/images/avatar-${size}.png`;
                }
            }
        },
        provideMockStore({
            selectors: [
                {
                    selector: appState.coreState,
                    value: {}
                },
                {
                    selector: gamePlayState,
                    value: {}
                },
                {
                    selector: appState.dashboardState,
                    value: {}
                },
            ]
        })
    ],
        [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]));


    beforeEach((async () => {
        fixture = await nsTestBedRender(GameOverComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
