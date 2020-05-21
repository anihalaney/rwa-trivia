import { SignupExtraInfoComponent } from './signup-extra-info.component';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store, MemoizedSelector } from '@ngrx/store';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { testData } from 'test/data';
import { CoreState, categoryDictionary } from 'shared-library/core/store';
import { coreState, UserActions, ActionWithPayload } from '../../../core/store';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('SignupExtraInfoComponent', () => {
  let component: SignupExtraInfoComponent;
  let fixture: ComponentFixture<SignupExtraInfoComponent>;
  let spy: any;
  let mockStore: MockStore<CoreState>;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
  let mockCategorySelector: MemoizedSelector<any, {}>;
  let mockRouter: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupExtraInfoComponent],
      imports: [RouterTestingModule.withRoutes([]), ReactiveFormsModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: coreState,
              value: {}
            },
            {
              selector: categoryDictionary,
              value: {}
            }
          ]
        }),
        {
          provide: Router,
          useValue: {
            url: '/signup-extra-info',
            navigate: (url) => {

            }
          }
        },
        UserActions
      ]
    });
  }));

  beforeEach(() => {
    // create component
    fixture = TestBed.createComponent(SignupExtraInfoComponent);
    // mock data
    mockStore = TestBed.get(Store);
    mockRouter = TestBed.get(Router);
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    mockCategorySelector = mockStore.overrideSelector(categoryDictionary, {});
    spy = spyOn(mockStore, 'dispatch');

    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  // Check created component
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // tslint:disable-next-line: max-line-length
  it(`Forms's email, and displayName fields should fill, phone number should null and emailEditable should be falsy and phoneEditable should be truthy  when store emit User`, () => {
    const user = testData.userList[2];
    mockCoreSelector.setResult({ user });
    mockStore.refreshState();
    expect(component.userForm.get('email').value).toEqual('test@test.com');
    expect(component.userForm.get('phoneNo').value).toEqual('');
    expect(component.userForm.get('displayName').value).toEqual('test');
    expect(component.emailEditable).toBeFalsy();
    expect(component.phoneEditable).toBeTruthy();

  });

  // tslint:disable-next-line: max-line-length
  it(`Forms's phone number and displayName fields should fill, email should null and phoneEditable should be truthy when store emit User`, () => {
    const user = testData.userList[3];
    mockCoreSelector.setResult({ user });
    mockStore.refreshState();
    expect(component.userForm.get('email').value).toEqual('');
    expect(component.userForm.get('phoneNo').value).toEqual('+14844732320');
    expect(component.userForm.get('displayName').value).toEqual('Mack');

    expect(component.emailEditable).toBeTruthy();
    expect(component.phoneEditable).toBeFalsy();

  });


  it('call to checkDisplayName function it should dispatch checkDisplayName Action ', () => {
    expect(component).toBeTruthy();

    const payloadData = 'test';

    spy.and.callFake((action: ActionWithPayload<string>) => {
      expect(action.type).toEqual(UserActions.CHECK_DISPLAY_NAME);
      expect(action.payload).toEqual(payloadData);
    });

    component.checkDisplayName('test');
    expect(mockStore.dispatch).toHaveBeenCalled();

  });


  it('call to submit function it should call checkDisplayName', () => {
    spyOn(component, 'checkDisplayName').and.callThrough();
    const user = testData.userList[2];
    mockCoreSelector.setResult({ user });
    mockStore.refreshState();
    component.submit();
    expect(component.checkDisplayName).toHaveBeenCalled();
  });

  it('When user submit form and form is invalid check for display name should not be called', () => {
    spyOn(component, 'checkDisplayName').and.callThrough();
    const user = testData.userList[2];
    mockCoreSelector.setResult({ user });
    mockStore.refreshState();
    component.userForm.get('email').setValue('test@');
    component.submit();
    expect(component.checkDisplayName).not.toHaveBeenCalled();
  });

  it('Form should have email pattern error when email enter does not match pattern ', () => {
    component.userForm.get('email').setValue('test');
    expect(component.userForm.get('email').errors).toEqual({
      'pattern': {
        // tslint:disable-next-line: max-line-length
        'actualValue': 'test', 'requiredPattern': '/^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/'
      }
    });
  });

  it('Form should have displayName required error when displayName is not set ', () => {
    expect(component.userForm.get('displayName').errors).toEqual({ 'required': true });
  });


  it(`Form should have phoneNo min length error when phoneno's length is less then 9 `, () => {
    component.userForm.get('phoneNo').setValue('123456');
    expect(component.userForm.get('phoneNo').errors).toEqual({
      minlength: {
        'actualLength': 6,
        'requiredLength': 9,
      }
    });
  });

  it(`Form should have phoneNo max length error when phoneno's length is less then 13 `, () => {
    component.userForm.get('phoneNo').setValue('123456789101112');
    expect(component.userForm.get('phoneNo').errors).toEqual({
      maxlength: {
        'actualLength': 15,
        'requiredLength': 13,
      }
    });
  });
  it(`It should dispatch add user profile action and navigate to 'select-category-tag'  when store emit checkDisplayName is true`, () => {
    const checkDisplayName = true;
    const user = testData.userList[2];
    const navigateSpy = spyOn(mockRouter, 'navigate');
    mockCoreSelector.setResult({ user });
    component.user = testData.userList[2];
    component.userForm.get('email').setValue('test@email.com');
    component.userForm.get('phoneNo').setValue('1234567890');
    component.userForm.get('displayName').setValue('Mack');
    const payloadData = { user: user, isLocationChanged: false };
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(UserActions.ADD_USER_PROFILE);
      expect(action.payload).toEqual(payloadData);
    });
    mockCoreSelector.setResult({ checkDisplayName: checkDisplayName });
    mockStore.refreshState();
    expect(mockStore.dispatch).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['select-category-tag']);

  });


  it(`It should have displayName exist error when store emit checkDisplayName is false`, () => {
    const checkDisplayName = false;
    const user = testData.userList[2];
    const navigateSpy = spyOn(mockRouter, 'navigate');
    mockCoreSelector.setResult({ user });
    component.user = testData.userList[2];
    component.userForm.get('email').setValue('test@email.com');
    component.userForm.get('phoneNo').setValue('1234567890');
    component.userForm.get('displayName').setValue('Mack');
    const payloadData = { user: user, isLocationChanged: false };
    spy.and.callFake((action: ActionWithPayload<any>) => {
      expect(action.type).toEqual(UserActions.ADD_USER_PROFILE);
      expect(action.payload).toEqual(payloadData);
    });
    mockCoreSelector.setResult({ checkDisplayName: checkDisplayName });
    mockStore.refreshState();

    expect(component.userForm.get('displayName').errors).toEqual({
      'exist': true
    });
  });

});
