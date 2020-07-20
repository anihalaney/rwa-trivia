import 'reflect-metadata';
import { BottomBarComponent } from 'shared-library/shared/mobile/component/bottom-bar/bottom-bar.component';
import { Utils } from 'shared-library/core/services/utils';
import { ElementRef } from '@angular/core';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { coreState, CoreState, UserActions, ActionWithPayload } from 'shared-library/core/store';
import { testData } from 'test/data';
import { of, Observable } from 'rxjs';


class MockRouter {
    public ne = new NavigationEnd(0, 'http://localhost:4200/login', 'http://localhost:4200/login');
    public events = new Observable(observer => {
        observer.next(this.ne);
        observer.complete();
    });
    public url = '/user/my/invite-friends';
    navigate = () => {
        return true;
    }

}

describe('BottomBarComponent', () => {

    let component: BottomBarComponent;
    let fixture: ComponentFixture<BottomBarComponent>;
    let spy: any;
    let router: Router;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;


    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([BottomBarComponent], [
        {
            provide: Utils,
            useValue: {
                focusTextField() {
                    return '';
                }
            }
        },
        provideMockStore({
            initialState: {},
            selectors: [
                {
                    selector: coreState,
                    value: {}
                }
            ]
        }),
        { provide: Router, useClass: MockRouter },
    ],
        [StoreModule.forRoot({}), RouterTestingModule.withRoutes([
            { path: 'url/test', component: BottomBarComponent }
        ]),
        NativeScriptRouterModule.forRoot([])]
    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(BottomBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        router = TestBed.get(Router);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on load component should set user', () => {
        const user = testData.userList[0];
        mockCoreSelector.setResult({ user: user });
        mockStore.refreshState();
        component.ngOnInit();
        expect(component.user).toEqual(user);
    });

    it('on call ngOnChanges it should set active menu', () => {
        component.isDrawerOpenOrClosed = 'drawerClosed';
        const spyOnBottomBarNavigationOnRouting = spyOn(component, 'bottomBarNavigationOnRouting');
        component.ngOnChanges();
        expect(spyOnBottomBarNavigationOnRouting).toHaveBeenCalledTimes(1);
    });

    it(`on call ngOnChanges it should set active menu as 'more'`, () => {
        component.isDrawerOpenOrClosed = 'drawerOpened';
        component.ngOnChanges();
        expect(component.activeMenu).toBe('more');
    });


    it(`on call bottomBarNavigationOnRouting and if current dashboard then activeMenu should be play`, () => {
        component.bottomBarNavigationOnRouting('/dashboard');
        expect(component.activeMenu).toBe('play');
    });

    it(`on call bottomBarNavigationOnRouting and if route is / then activeMenu should be play`, () => {
        component.bottomBarNavigationOnRouting('/');
        expect(component.activeMenu).toBe('play');
    });

    it(`on call bottomBarNavigationOnRouting and if current route is game-play/game-options then activeMenu should be play`, () => {
        component.bottomBarNavigationOnRouting('game-play/game-options');
        expect(component.activeMenu).toBe('play');
    });

    it(`on call bottomBarNavigationOnRouting and if current leaderboard then activeMenu should be leaderboard`, () => {
        component.bottomBarNavigationOnRouting('/dashboard/leaderboard');
        expect(component.activeMenu).toBe('leaderboard');
    });

    it(`on call bottomBarNavigationOnRouting and if current invite-friends then activeMenu should be friends`, () => {
        component.bottomBarNavigationOnRouting('/user/my/invite-friends');
        expect(component.activeMenu).toBe('friends');
    });

    it(`on call bottomBarNavigationOnRouting and if current invite-friends then activeMenu should be friends`, () => {
        component.bottomBarNavigationOnRouting('');
        expect(component.activeMenu).toBe('more');
    });

    it(`on call bottomBarClick  with play param, it should set active menu 'play' and redirect to dashboard`, () => {
        const navigateSpy = spyOn(router, 'navigate');
        spyOn(component, 'radSideDrawer').and.returnValue({ closeDrawer: () => { } });
        component.bottomBarClick('play');
        expect(component.activeMenu).toBe('play');
        expect(navigateSpy).toHaveBeenCalledWith(['/dashboard'], { clearHistory: true });
    });

    it(`on call bottomBarClick  with leaderboard param, it should set active menu 'leaderboard' and redirect to leaderboard`, () => {
        const navigateSpy = spyOn(router, 'navigate');
        spyOn(component, 'radSideDrawer').and.returnValue({ closeDrawer: () => { } });
        component.bottomBarClick('leaderboard');
        expect(component.activeMenu).toBe('leaderboard');
        expect(navigateSpy).toHaveBeenCalledWith(['/dashboard/leaderboard'], { clearHistory: true });
    });

    it(`on call bottomBarClick with friends param, it should set active menu 'friends' and redirect to invite-friends`, () => {
        const navigateSpy = spyOn(router, 'navigate');
        spyOn(component, 'radSideDrawer').and.returnValue({ closeDrawer: () => { } });
        component.bottomBarClick('friends');
        expect(component.activeMenu).toBe('friends');
        expect(navigateSpy).toHaveBeenCalledWith(['/user/my/invite-friends'], { clearHistory: true });
    });

    it(`on call bottomBarClick with play more, it should set active menu 'more' and open more menu options`, () => {
        const navigateSpy = spyOn(router, 'navigate');
        spyOn(component.open, 'emit');
        spyOn(component, 'radSideDrawer').and.returnValue({ closeDrawer: () => { }, showDrawer: () => { } });
        component.bottomBarClick('more');
        expect(component.activeMenu).toBe('more');
        expect(component.open.emit).toHaveBeenCalledWith();
    });

    it(`on call bottomBarClick with friends param, it should set activeMenu and animate menu`, () => {
        spyOn(component, 'radSideDrawer').and.returnValue({ closeDrawer: () => { }, showDrawer: () => { } });
        component.animateMenu = 'play';
        component.bottomBarClick('play');
        expect(component.activeMenu).toBe('play');
    });

    it(`on call bottomBarClick with more param, it should set undefine prev menu and animate menu`, () => {
        spyOn(component, 'radSideDrawer').and.returnValue({ closeDrawer: () => { }, showDrawer: () => { } });

        component.bottomBarClick('more');
        expect(component.prevMenu).toBeUndefined();
        expect(component.animateMenu).toBeUndefined();
    });

    it(`on call goToDashboard it should redirect to dashboard`, () => {
        const navigateSpy = spyOn(router, 'navigate');
        component.goToDashboard();
        expect(navigateSpy).toHaveBeenCalledWith(['/dashboard'], { clearHistory: true });

    });



});
