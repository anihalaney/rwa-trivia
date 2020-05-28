import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { Component, Directive, Input, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import 'hammerjs';
import { OpenUserProfileDirective } from './open-user-profile.directive';
import { testData } from 'test/data';

@Component({
  template: `<img
    [stlOpenUserProfile]="{userId: user?.userId, redirectTo: loggedInUserId === user?.userId ? 'userProfile': 'otherUserProfile'}"
    src="sample_Image.jpg" alt="User Profile Image" />`
})

class TestOpenUserProfileComponent {
  constructor(public router: Router) { }
  @Input('stlOpenUserProfile') user: any;

  @HostListener('click', ['$event'])
  @HostListener('tap', ['$event'])

  onClick(event) {
      if (this.user.userId && this.user.userId !== '' && this.user.redirectTo === 'otherUserProfile' && !this.user.isGamePlay) {
        this.router.navigate([`/user/game-profile/${this.user.userId}`]);
      } else if (this.user.userId && this.user.userId !== '' && this.user.redirectTo === 'userProfile' && !this.user.isGamePlay) {
        this.router.navigate([`/user/my/game-profile/${this.user.userId}`]);
      }
    }
}

describe('OpenUserProfileDirective', () => {
  let component: TestOpenUserProfileComponent;
  let fixture: ComponentFixture<TestOpenUserProfileComponent>;
  let spy: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [
        TestOpenUserProfileComponent,
        OpenUserProfileDirective
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });

    fixture = TestBed.createComponent(TestOpenUserProfileComponent);
    component = fixture.componentInstance;
    component.user = testData.userList[0];
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('Initial value of the user should be Truthy', () => {
    expect(component.user).toBeTruthy();
  });

  it(`redirect to other user's game profile if user click on other user's user card`, inject([Router], (mockRouter: Router) => {
    component.user.redirectTo = 'otherUserProfile';
    component.user.isGamePlay = false;
    spy = spyOn(mockRouter, 'navigate');
    component.onClick({});
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/user/game-profile/${component.user.userId}`]);
  }));

  it(`redirect to own game profile if user click on own user card`, inject([Router], (mockRouter: Router) => {
    component.user.redirectTo = 'userProfile';
    component.user.isGamePlay = false;
    spy = spyOn(mockRouter, 'navigate');
    component.onClick({});
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/user/my/game-profile/${component.user.userId}`]);
  }));

});
