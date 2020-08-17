import { ProfileCardComponent } from './profile-card.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { RouterTestingModule } from '@angular/router/testing';
import { AppState, appState } from '../../store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector, Store } from '@ngrx/store';
import { CoreState } from 'shared-library/core/store';
import { Utils } from 'shared-library/core/services';
import { MatSnackBarModule } from '@angular/material';
import { User } from 'shared-library/shared/model';
import { testData } from 'test/data';

describe('ProfileCardComponent', () => {
    let component: ProfileCardComponent;
    let fixture: ComponentFixture<ProfileCardComponent>;
    let mockStore: MockStore<AppState>;
    let mockCoreSelector: MemoizedSelector<AppState, Partial<CoreState>>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProfileCardComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: Utils,
                    useValue: {
                        getImageUrl(user: User, width: Number, height: Number, size: string): any {
                            return `assets/images/avatar-${size}.png`;
                        }
                    }
                },
                provideMockStore({
                    selectors: [
                        {
                            selector: appState.coreState,
                            value: {}
                        }
                    ]
                })
            ],
            imports: [MatSnackBarModule, RouterTestingModule.withRoutes([])]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileCardComponent);
        // mock data
        mockStore = TestBed.get(Store);
        mockCoreSelector = mockStore.overrideSelector<AppState, Partial<CoreState>>(appState.coreState, {});
        component = fixture.debugElement.componentInstance;
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('On load component should set user and userProfileImageUrl', () => {
        const user: User = testData.userList[0];
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        fixture.detectChanges();
        const imageURL = component.getImageUrl(user);

        expect(component.user).toEqual(user);
        expect(component.userProfileImageUrl).toEqual(imageURL);
    });

    it('Verify navigateToProfile function it should call router.navigate method', () => {
        const navigateSpy = spyOn(component.router, 'navigate');
        const user: User = testData.userList[0];
        mockCoreSelector.setResult({ user });
        mockStore.refreshState();
        fixture.detectChanges();
        component.navigateToProfile();

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(['user/my/profile', user.userId]);
    });

    it('Call to getImageUrl should return image Url', () => {
        const user: User = testData.userList[0];
        const url = component.getImageUrl(user);

        expect(url).toBe('assets/images/avatar-400X400.png');
    });
});
