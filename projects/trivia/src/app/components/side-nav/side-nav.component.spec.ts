import { SideNavComponent } from './side-nav.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AppState, appState } from '../../store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector, Store } from '@ngrx/store';
import { CoreState, coreState } from 'shared-library/core/store';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { Utils, WindowRef } from 'shared-library/core/services';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'shared-library/shared/model';
import { testData } from 'test/data';
import { MatSnackBarModule } from '@angular/material';
import { projectMeta } from 'shared-library/environments/environment';

describe('SideNavComponent', () => {

    let component: SideNavComponent;
    let fixture: ComponentFixture<SideNavComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;
    let mockCoreStateSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SideNavComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [MatSnackBarModule, RouterTestingModule.withRoutes([])],
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
        fixture = TestBed.createComponent(SideNavComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        mockCoreStateSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});

        component = fixture.debugElement.componentInstance;

    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('On load component should set userDict when store dispatched userDict', () => {
        const user: User = { ...testData.userList[0] };
        const userDict = { '4kFa6HRvP5OhvYXsH9mEsRrXj4o2': user };
        mockCoreSelector.setResult({ userDict });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.userDict).toEqual(userDict);
    });

    it('On load component should set applicationSettings when store dispatched applicationSettings', () => {
        const applicationSettings: any[] = [];
        applicationSettings.push(testData.applicationSettings);
        mockCoreStateSelector.setResult({ applicationSettings });
        mockStore.refreshState();
        fixture.detectChanges();

        expect(component.applicationSettings).toEqual(applicationSettings[0]);
    });

    it('On load component should set user', () => {
        component.user = { ...testData.userList[0] };
        fixture.detectChanges();

        expect(component.user).not.toBeUndefined();
    });

    it('On load component should set blogUrl, playstoreUrl and appStoreUrl', () => {
        expect(component.blogUrl).toEqual(projectMeta.blogUrl);
        expect(component.playstoreUrl).toEqual(projectMeta.playStoreUrl);
        expect(component.appstoreUrl).toEqual(projectMeta.appStoreUrl);
    });
});
