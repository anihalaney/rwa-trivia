
import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Directive, Input, HostListener, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import 'hammerjs';
import { OpenUserProfileDirective } from './open-user-profile.directive';
import { testData } from 'test/data';

@Component({
  template: `<img [stlOpenUserProfile]="{userId: user.userId, redirectTo: 'otherUserProfile'}" src="sample_Image.jpg"
        alt="User Profile Picture" class="image1"/>
        <img [stlOpenUserProfile]="{userId: user.userId, redirectTo: 'userProfile'}" src="sample_Image.jpg"
        alt="User Profile Picture" class="image2" />`
})

class TestOpenUserProfileComponent {
  constructor(public router: Router) { }
  @Input('stlOpenUserProfile') user: any;

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
    spy = spyOn(mockRouter, 'navigate');
    fixture.debugElement.query(By.css('.image1')).triggerEventHandler('click', null);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/user/game-profile/${component.user.userId}`]);
  }));

  it(`redirect to own game profile if user click on own user card`, inject([Router], (mockRouter: Router) => {
    spy = spyOn(mockRouter, 'navigate');
    fixture.debugElement.query(By.css('.image2')).triggerEventHandler('click', null);
    expect(mockRouter.navigate).toHaveBeenCalledWith([`/user/my/game-profile/${component.user.userId}`]);
  }));

});
