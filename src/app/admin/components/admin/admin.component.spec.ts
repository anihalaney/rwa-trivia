import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { Router } from '@angular/router';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { Store } from '@ngrx/store';

import { MockStore, TEST_DATA } from '../../../testing';
import { RouterStub, RouterOutletStubComponent, RouterLinkStubDirective } from '../../../testing';
import { AdminComponent } from './admin.component';
import { AuthenticationService } from '../../../core/services';

describe('Component: AdminComponent', () => {

  let comp: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let de: DebugElement;
  let _navEl: HTMLElement;
  let _store: any;
  let _router: RouterStub;
  
  //Define intial state and test state
  let _initialState = { user: null };

  let adminUser = TEST_DATA.userList[0];
  adminUser.roles["admin"] = true;
  let _testState = { user: adminUser };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminComponent, RouterOutletStubComponent, RouterLinkStubDirective ], // declare the test component
      imports: [
        //Material
        SharedMaterialModule
      ],
    schemas:      [ NO_ERRORS_SCHEMA ],
    providers:[
        {provide: Router, useValue: new RouterStub() },
        {provide: Store, useValue: new MockStore(_initialState)}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    _router = fixture.debugElement.injector.get(Router);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    //de = fixture.debugElement.query(By.css('.my-content'));
    //_navEl = de.nativeElement;

  }));

  //Unit Tests
  it('Admin Links', () => {
    _store.next(_testState);
    fixture.detectChanges();

    let deAddLinks = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
    let dirLinks = deAddLinks.map(d => d.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    expect(dirLinks.length).toBe(4, '4 router links for users');
    expect(dirLinks[0].linkParams[0]).toBe('./', 'Link to admin root');
    expect(dirLinks[1].linkParams[0]).toBe('./categories', 'Link to admin categories');
    expect(dirLinks[2].linkParams[0]).toBe('./tags', 'Link to admin tags');
    expect(dirLinks[3].linkParams[0]).toBe('./questions', 'Link to admin questions');
  });

  it('Not logged in OR not an Admin', () => {
    let spy = spyOn(_router, "navigate");

    _testState.user.roles = [];
    _store.next(_testState);
    fixture.detectChanges();
    expect(_router.navigate).toHaveBeenCalled();
    expect(spy.calls.mostRecent().args[0][0]).toBe('/', 'Redirection to Home Page');

    _store.next(_initialState);
    fixture.detectChanges();
    expect(_router.navigate).toHaveBeenCalled();
    expect(spy.calls.mostRecent().args[0][0]).toBe('/', 'Redirection to Home Page');
  });

});

