import { AchievementsComponent } from './achievements.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { appState, AppState } from '../../store';
import { dashboardState, DashboardState } from '../../dashboard/store';
import { MemoizedSelector, Store } from '@ngrx/store';
import { CoreState } from 'shared-library/core/store';
import { User } from 'shared-library/shared/model';
import { testData } from 'test/data';
import * as dashboardAction from '../../dashboard/store/actions';

describe('AchievementsComponent', () => {
    let component: AchievementsComponent;
    let fixture: ComponentFixture<AchievementsComponent>;
    let mockStore: MockStore<AppState>;
    let spy: any;
    let user: User;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
    let mockDashboardSelector: MemoizedSelector<AppState, Partial<DashboardState>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AchievementsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {}
                        },
                        {
                            selector: dashboardState,
                            value: {}
                        }
                    ]
                })
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AchievementsComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        mockDashboardSelector = mockStore.overrideSelector<AppState, Partial<DashboardState>>(dashboardState, {});
        component = fixture.debugElement.componentInstance;
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Verify user initial value it should be undefined', () => {
        expect(component.user).toBeUndefined();
    });

    it('Verify achievements initial value it should be empty', () => {
        expect(component.achievements).toEqual([]);
    });

    it('On load component should set user and store should dispatch LoadAchievements dashbord action', () => {
        user = testData.userList[0];
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.user).toEqual(user);
        expect(spy).toHaveBeenCalledWith(
            new dashboardAction.LoadAchievements()
        );
    });

    it('On load component should set achievements', () => {
        const achievements: any[] = [{ name: 'Win' }];
        mockDashboardSelector.setResult({ achievements });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.achievements).toEqual(achievements);
    });
});
