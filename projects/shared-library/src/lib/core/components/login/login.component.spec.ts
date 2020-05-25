import { LoginComponent } from "./login.component";
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CoreState, UIStateActions, coreState } from '../../store';
import { Store, StoreModule, MemoizedSelector } from '@ngrx/store';
import { testData } from 'test/data';
import { ReactiveFormsModule } from "@angular/forms";
import { FirebaseAuthService } from "../../auth/firebase-auth.service";
import { WindowRef } from "../../services";


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let spy: any;
  let mockStore: MockStore<CoreState>;
  let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, StoreModule.forRoot({}), MatDialogModule],
      schemas: [NO_ERRORS_SCHEMA],
      // Set provider
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            {
              selector: coreState,
              value: {}
            },
          ]
        }),
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        UIStateActions,
        {
          provide: FirebaseAuthService,
          useValue: {
            googleLogin() {
              return true;
            }
          }
        }
        ,
        WindowRef
      ],
    });
  }));

  beforeEach(() => {
    // create component
    fixture = TestBed.createComponent(LoginComponent);
    // mock data
    mockStore = TestBed.get(Store);
    spy = spyOn(mockStore, 'dispatch');
    // Re-create component
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
    fixture.detectChanges();
  });

  // It should create component
  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('on load component it should set applicationSettings', () => {
    mockCoreSelector.setResult({ applicationSettings: [testData.applicationSettings] });
    mockStore.refreshState();
    expect(component.applicationSettings).toStrictEqual(testData.applicationSettings);
  });

});
