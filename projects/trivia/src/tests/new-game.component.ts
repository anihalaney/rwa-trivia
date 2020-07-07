import 'reflect-metadata';
import { NewGameComponent } from '../app/game-play/components/new-game/new-game.component.tns';
import { Utils, WindowRef } from 'shared-library/core/services';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Router } from '@angular/router';
import { Store, MemoizedSelector } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState, appState } from './../app/store';
import { testData } from 'test/data';
import { coreState, CoreState, UserActions, GameActions, TagActions } from 'shared-library/core/store';
import { User } from 'shared-library/shared/model';
import { NavigationService } from 'shared-library/core/services/mobile';

describe('NewGameComponent', () => {

    let component: NewGameComponent;
    let fixture: ComponentFixture<NewGameComponent>;
    let mockStore: MockStore<AppState>;
    let spy: any;
    let router: Router;
    let user: User;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([NewGameComponent], [
        UserActions,
        GameActions,
        TagActions,
        WindowRef,
        NavigationService,
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
                }
            ]
        })
    ],
        [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]));


    beforeEach((async () => {
        fixture = await nsTestBedRender(NewGameComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    }));

    afterEach(nsTestBedAfterEach(true));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
