import 'reflect-metadata';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
    nsTestBedAfterEach,
    nsTestBedBeforeEach,
    nsTestBedRender,
} from 'nativescript-angular/testing';

import { MyQuestionsComponent } from './../app/user/components/my-questions/my-questions.component.tns';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule, MemoizedSelector, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { testData } from 'test/data';
import { GameActions, QuestionActions, UserActions } from 'shared-library/core/store/actions';
import { RouterTestingModule } from '@angular/router/testing';

import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { User, Game, PlayerMode, GameStatus, OpponentType, Invitation } from 'shared-library/shared/model';
import { AppState, appState } from './../app/store';
import { userState, UserState } from './../app/user/store';
import { Router } from '@angular/router';


describe('MyQuestionsComponent', () => {
    let component: MyQuestionsComponent;
    let fixture: ComponentFixture<MyQuestionsComponent>;
    let user: User;
    let router: Router;
    let spy: any;
    let mockStore: MockStore<AppState>;

    afterEach(nsTestBedAfterEach());
    beforeEach(nsTestBedBeforeEach(
        [MyQuestionsComponent],
        [GameActions, UserActions, QuestionActions,
            provideMockStore({
                selectors: [
                    {
                        selector: appState.coreState,
                        value: {}
                    },
                    {
                        selector: userState,
                        value: {}
                    }
                ]
            })
        ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));


    beforeEach((async () => {
        fixture = await nsTestBedRender(MyQuestionsComponent);
        mockStore = TestBed.get(Store);
        component = fixture.componentInstance;
        spy = spyOn(mockStore, 'dispatch');
        router = TestBed.get(Router);
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on Publish tab clicked it should show publish tab', () => {
        component.onSelectTab('published');
        expect(component.tab).toBe('published');
    });

    it('on Unpublished tab clicked it should show unpublished tab', () => {
        component.onSelectTab('unpublished');
        expect(component.tab).toBe('unpublished');
    });
});
