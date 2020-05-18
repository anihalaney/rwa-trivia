import { BlogComponent } from './blog.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { appState, AppState } from '../../../store';
import { MatSnackBarModule } from '@angular/material';
import { Store } from '@ngrx/store';
import { testData } from 'test/data';
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
        expect(component.blogData).toEqual([]);
    });

    it('Verify onNotify function work', () => {
        component.blogData = testData.blogs;
        const blogTestData = testData.blogs[0];
        blogTestData.share_status = true;
        component.onNotify(blogTestData);
        expect(component.blogData[0].share_status).toEqual(blogTestData.share_status);
    });

    it('Verify blog data is set after the value is emitted', () => {
        blogData = testData.blogs;
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
