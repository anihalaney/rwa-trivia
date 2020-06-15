import { UserStatsCardComponent } from './user-stats-card.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AppState, appState } from '../../store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Utils, WindowRef } from 'shared-library/core/services';
import { MemoizedSelector, Store } from '@ngrx/store';
import { CoreState } from 'shared-library/core/store';
import { MatSnackBarModule } from '@angular/material';
import { User } from 'shared-library/shared/model';
import { testData } from 'test/data';

describe('UserStatsCardComponent', () => {

    let component: UserStatsCardComponent;
    let fixture: ComponentFixture<UserStatsCardComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
    let user: User;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UserStatsCardComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [MatSnackBarModule],
            providers: [
                Utils,
                WindowRef,
                provideMockStore({
                    initialState: {},
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {
                            }
                        }
                    ]
                })
            ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(UserStatsCardComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});

        component = fixture.debugElement.componentInstance;

    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('account initial value should be undefined', () => {
        expect(component.account).toBeUndefined();
    });

    it('On load component should set account information when store emitted account', () => {
        user = { ...testData.userList[0] };
        mockCoreSelector.setResult({ account: user.account });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.account).toEqual(user.account);
    });
});
