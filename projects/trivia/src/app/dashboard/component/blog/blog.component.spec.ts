import { BlogComponent } from './blog.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { appState, AppState } from '../../../store';
import { MatSnackBarModule } from '@angular/material';
import { Store } from '@ngrx/store';
import { TEST_DATA } from 'shared-library/testing/test.data';
import { DashboardState } from '../../store';

describe('BlogComponent', () => {
    let component: BlogComponent;
    let fixture: ComponentFixture<BlogComponent>;
    let spy: any;
    let mockStore: MockStore<AppState>;
    let blogData: any[];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BlogComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                provideMockStore({
                    selectors: [{
                        selector: appState.dashboardState,
                        value: {}
                    }]
                })
            ],
            imports: [MatSnackBarModule]
        });
    }));

    beforeEach(() => {
        // Create component
        fixture = TestBed.createComponent(BlogComponent);
        // mock data
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        component = fixture.debugElement.componentInstance;
    });

    // Check component created successfully
    it('Should create component', () => {
        expect(component).toBeTruthy();
    });

    it('Blog data should be undefined when component is created', () => {
        expect(component.blogData).toEqual(undefined);
    });

    it('Subscription should not be empty when component is created', () => {
        expect(component.subscriptions).not.toEqual([]);
    });

    it('Verify onNotify function work', () => {
        component.blogData = TEST_DATA.blog;
        component.onNotify(TEST_DATA.blog[0]);
        expect(component.blogData[0].share_status).toEqual(TEST_DATA.blog[0].share_status);
    });

    it('Verify subscription data in constructor and ngAfterViewInit', () => {
        blogData = TEST_DATA.blog;
        mockStore.overrideSelector<AppState, Partial<DashboardState>>(appState.dashboardState, {
            blogs: blogData
        });
        mockStore.refreshState();
        fixture.detectChanges();
        expect(component.blogData).toEqual(blogData);
    });

    afterEach(() => {
        fixture.destroy();
    });
});
