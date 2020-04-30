import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteToPlayComponent } from './invite-to-play.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UserActions } from 'shared-library/core/store/actions/user.actions';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

class RouterStub {
  navigateByUrl(url: string) { return url; }
}

class UserActionStub {

}

describe('InviteToPlayComponent', () => {
  const initialState = { loggedIn: false };
  let component: InviteToPlayComponent;
  let fixture: ComponentFixture<InviteToPlayComponent>;
  let _store: any;
  let spy: any;
  let _userActions: UserActions;
  let de: DebugElement;
  let _friendListEl: HTMLElement;
  const friends = [
    {
      myFriends: {
        date: '345345234',
        created_uid: '33e33333',
        gamePlayed: 5,
        losses: 3,
        wins: 2
      },
      created_uid: 'fdsfadsfasdf',
    },
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteToPlayComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        UserActions,
        {provide: Router, useClass: RouterStub},
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteToPlayComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    // get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    _userActions = fixture.debugElement.injector.get(UserActions);
    // get object of action
    spy = spyOn(_store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have container', () => {

    const fixture = TestBed.createComponent(InviteToPlayComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('unitTestAngular app is running!');

  });

  it('should have new land container', () => {

    const fixture = TestBed.createComponent(InviteToPlayComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.la-la-land').textContent).toContain('ok it failed');
  });

  it('get the data', () => {
    _store.dispatch(_userActions.loadUserFriendsSuccess(this.friends));
    fixture.detectChanges();
    _friendListEl = fixture.nativeElement.querySelector('ok');
    component.uFriends.forEach(data => {
      expect(_friendListEl.textContent).toContain(data);
    });
  });

});
