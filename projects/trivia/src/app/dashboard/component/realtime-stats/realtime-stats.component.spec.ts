import { RealtimeStatsComponent } from "./realtime-stats.component";
import { async, ComponentFixture, TestBed} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '../../../store';
import { SystemStats } from 'shared-library/shared/model';
import { Store} from '@ngrx/store';
import { DashboardState, dashboardState } from '../../store';
import { testData } from 'test/data';
import * as StatActions from '../../store/actions';

describe('RealtimeStatsComponent', () => {
    let component: RealtimeStatsComponent;
    let fixture: ComponentFixture<RealtimeStatsComponent>;
    let systemStat: SystemStats;
    let spy: any;
    let mockStore: MockStore<AppState>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RealtimeStatsComponent],
            schemas: [NO_ERRORS_SCHEMA],
            // Set provider
            providers: [
                provideMockStore({
                    initialState: {},
                    selectors: [
                        {
                            selector: dashboardState,
                            value: {}
                        }
                    ]
                })
            ]
        });
    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(RealtimeStatsComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        // Re-create component
        fixture = TestBed.createComponent(RealtimeStatsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // It should create component
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // Verifying after dispach action
    it('Verify that the laod system stat action is dispached', async () => {
        mockStore.overrideSelector<AppState, Partial<DashboardState>>(dashboardState, {});
        mockStore.refreshState();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalledWith(
            new StatActions.LoadSystemStat()
        );
    });

    // Verifying systemStat data
    it('Verify the data for systemStat', () => {
        systemStat = { ...testData.realTimeStats};
            mockStore.overrideSelector<AppState, Partial<DashboardState>>(dashboardState, {
            systemStat: systemStat
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.systemStats).toEqual(systemStat);
    });

    // Check the initial value of systemStat
    it('Verify the systemStat is null initially', () => {
        expect(component.systemStats).toBe(undefined);
    });

    afterEach(() => {
        fixture.destroy();
    });
});
