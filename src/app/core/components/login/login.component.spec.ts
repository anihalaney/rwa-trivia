import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA }    from '@angular/core';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { AngularFire, AuthProviders, AuthMethods, FirebaseAuthConfig } from 'angularfire2';

import { MockStore, TEST_DATA } from '../../../testing';
import { LoginComponent } from './login.component';
import { PasswordAuthComponent } from './password-auth.component';

describe('Component: LoginComponent', () => {

  let comp: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let afAuthMock = { "auth": {
                      "login": (auth: {method?: AuthMethods;
                                        provider?: AuthProviders;
                                    }) => {}
                     } 
                  };
  let dialogRef = { "close": () => {}};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ], // declare the test component
      imports: [
        //Material
        SharedMaterialModule
      ],
    schemas:      [ NO_ERRORS_SCHEMA ],
    providers:[
        MdDialog,
        {provide: MdDialogRef, useValue: dialogRef},
        {provide: AngularFire, useValue: afAuthMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);

    //get the injected instances
    //_store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('h1'));
    _titleEl = de.nativeElement;
  }));

  //Unit Tests
  it('Display Title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Choose Login Method");
  });

  it('Display Buttons', () => {
    fixture.detectChanges();

    let deButtons = fixture.debugElement.queryAll(By.css('button'));
    let buttons = deButtons.map(d => d.nativeElement); 
    expect(buttons.length).toBe(6);
    expect(buttons[0].textContent).toContain("Google");
    expect(buttons[1].textContent).toContain("facebook");
    expect(buttons[2].textContent).toContain("Twitter");
    expect(buttons[3].textContent).toContain("Github");
    expect(buttons[4].textContent).toContain("Email/Password");
    expect(buttons[5].textContent).toContain("Cancel");
  });

  it('Button Actions', 
    inject([
      MdDialog, AngularFire, MdDialogRef
    ],
    (dialog: MdDialog, af: AngularFire, dRef: MdDialogRef<LoginComponent>) => {

    let spy = spyOn(af.auth, "login");
    fixture.detectChanges();

    let deButtons = fixture.debugElement.queryAll(By.css('button'));

    deButtons[0].triggerEventHandler('click', null);
    expect(af.auth.login).toHaveBeenCalled();
    expect(spy.calls.mostRecent().args[0].provider).toBe(AuthProviders.Google, 'Provider Google');
    expect(spy.calls.mostRecent().args[0].method).toBe(AuthMethods.Popup, 'Method Popup');

    deButtons[1].triggerEventHandler('click', null);
    expect(af.auth.login).toHaveBeenCalled();
    expect(spy.calls.mostRecent().args[0].provider).toBe(AuthProviders.Facebook, 'Provider Facebook');
    expect(spy.calls.mostRecent().args[0].method).toBe(AuthMethods.Popup, 'Method Popup');

    deButtons[2].triggerEventHandler('click', null);
    expect(af.auth.login).toHaveBeenCalled();
    expect(spy.calls.mostRecent().args[0].provider).toBe(AuthProviders.Twitter, 'Provider Twitter');
    expect(spy.calls.mostRecent().args[0].method).toBe(AuthMethods.Popup, 'Method Popup');

    deButtons[3].triggerEventHandler('click', null);
    expect(af.auth.login).toHaveBeenCalled();
    expect(spy.calls.mostRecent().args[0].provider).toBe(AuthProviders.Github, 'Provider Github');
    expect(spy.calls.mostRecent().args[0].method).toBe(AuthMethods.Popup, 'Method Popup');

    let spy2 = spyOn(dialog, "open")
            .and.callFake((type: any, options: any) => {
              expect(typeof type).toEqual("function");
              expect(options.disableClose).toEqual(false);
            });

    deButtons[4].triggerEventHandler('click', null);
    expect(spy2).toHaveBeenCalled();

    let spy3 = spyOn(dRef, "close")
            .and.callFake(() => { });
    deButtons[5].triggerEventHandler('click', null);
    expect(spy3).toHaveBeenCalled();

    })
  );


});
