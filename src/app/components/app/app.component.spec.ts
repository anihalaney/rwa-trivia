import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { Router } from '@angular/router';
import { SharedMaterialModule } from '../../shared/shared-material.module';
import { Store } from '@ngrx/store';

import { MockStore, MockAuthService, TEST_DATA } from '../../testing';
import { RouterStub, RouterOutletStubComponent, RouterLinkStubDirective } from '../../testing';
import { AppComponent } from './app.component';
import { AuthenticationService } from '../../core/services';
import { CategoryActions, TagActions, QuestionActions, UserActions } from '../../core/store/actions';

describe('Component: AppComponent', () => {

  let comp: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let de: DebugElement;
  let _navEl: HTMLElement;
  let _store: any;
  let _router: RouterStub;
  let _authService: MockAuthService;
  
  //Define intial state and test state
  let _initialState = {
                        questionSaveStatus: "",
                        user: null,
                        loginRedirectUrl: ""
                      };

  let user = TEST_DATA.userList[0];
  let _testState = {
                        questionSaveStatus: "",
                        user: user,
                        loginRedirectUrl: ""
                  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, RouterOutletStubComponent, RouterLinkStubDirective ], // declare the test component
      imports: [
        //Material
        SharedMaterialModule
      ],
    schemas:      [ NO_ERRORS_SCHEMA ],
    providers:[
        CategoryActions, TagActions, QuestionActions,
        {provide: Router, useValue: new RouterStub() },
        {provide: AuthenticationService, useValue: new MockAuthService() },
        {provide: Store, useValue: new MockStore(_initialState)}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    _router = fixture.debugElement.injector.get(Router);
    _authService = fixture.debugElement.injector.get(AuthenticationService);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('.my-content'));
    _navEl = de.nativeElement;

  }));

  //Unit Tests
  it('Display Title and User Links', () => {
    comp.title = "Testing Trivia";
    fixture.detectChanges();
    expect(_navEl.textContent).toContain("Testing Trivia");

    let deAddLinks = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
    let dirLinks = deAddLinks.map(d => d.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    expect(dirLinks.length).toBe(2, '2 router links for users');
    expect(dirLinks[0].linkParams[0]).toBe('/', 'Link to Home Page');
    expect(dirLinks[1].linkParams[0]).toBe('/my-questions', 'Link to My Questions');
  });

  it('Admin Links', () => {
    _testState.user.roles['admin'] = true;
    _store.next(_testState);
    fixture.detectChanges();

    let deAddLinks = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
    let dirLinks = deAddLinks.map(d => d.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    expect(dirLinks.length).toBe(3, '3 router links for admins');
    expect(dirLinks[0].linkParams[0]).toBe('/', 'Link to Home Page');
    expect(dirLinks[1].linkParams[0]).toBe('/my-questions', 'Link to My Questions');
    expect(dirLinks[2].linkParams[0]).toBe('/admin', 'Link to Admin');
  });

  it('User login', () => {
    _testState.loginRedirectUrl = "new_url";

    let spy = spyOn(_router, "navigate");
    _store.next(_testState);

    fixture.detectChanges();

    expect(comp.user).toBe(user);
    expect(_router.navigate).toHaveBeenCalled();
    expect(spy.calls.first().args[0][0]).toBe(_testState.loginRedirectUrl, 'Login redirection');

    _testState.user = null;
    _store.next(_testState);

    fixture.detectChanges();

    expect(comp.user).toBe(null);
    expect(_router.navigate).toHaveBeenCalled();
    expect(spy.calls.mostRecent().args[0][0]).toBe('/', 'Logout redirection');

    //restore _testState
    _testState.user = user;
  });

  it('Login / Logout Buttons', () => {
    _testState.loginRedirectUrl = "new_url";

    spyOn(_authService, "logout");
    spyOn(_authService, "ensureLogin");

    _testState.user = user;
    _store.next(_testState);

    fixture.detectChanges();
    let logoutButton  = fixture.debugElement.query(By.css(".logout-button")); // find logout
    logoutButton.triggerEventHandler('click', null);
    expect(_authService.logout).toHaveBeenCalled();

    _testState.user = null;
    _store.next(_testState);

    fixture.detectChanges();
    let loginButton  = fixture.debugElement.query(By.css(".login-button")); // find login
    loginButton.triggerEventHandler('click', null);
    expect(_authService.ensureLogin).toHaveBeenCalled();

    //restore _testState
    _testState.user = user;
  });

});

