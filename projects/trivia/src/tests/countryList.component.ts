import 'reflect-metadata';
import { CountryListComponent } from 'shared-library/shared/mobile/component/countryList/countryList.component';
import { Utils } from 'shared-library/core/services/utils';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { StoreModule, Store, MemoizedSelector } from '@ngrx/store';
import { coreState, CoreState, UserActions, UIStateActions, ActionWithPayload } from 'shared-library/core/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AuthenticationProvider, FirebaseAuthService } from 'shared-library/core/auth';
import { User } from 'shared-library/shared/model';
import { testData } from 'test/data';
import { RouterExtensions } from 'nativescript-angular/router';
import { of, Observable } from 'rxjs';
import { SearchCountryFilterPipe } from 'shared-library/shared/pipe/search-country-filter.pipe';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

describe('CountryListComponent', async () => {

    let component: CountryListComponent;
    let fixture: ComponentFixture<CountryListComponent>;
    let user: User;
    let mockStore: MockStore<CoreState>;
    let mockCoreSelector: MemoizedSelector<CoreState, Partial<CoreState>>;
    const applicationSettings: any[] = [];
    let spy: any;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([CountryListComponent, SearchCountryFilterPipe], [
        {
            provide: Utils,
            useValue: {
                showMessage(type: string, message: string) { }
            }
        },
        FormBuilder,
        UserActions,
        UIStateActions,
        {
            provide: ModalDialogParams,
            useValue: {
                context: {
                    Country: ['India'],
                    closeObserver: of(),
                },
                closeCallback(param) {
                    return '';
                }
            }
        },
        {
            provide: FirebaseAuthService,
            useValue: {

                authState() {
                    return of();
                }
            }
        },
        {
            provide: AuthenticationProvider,
            useValue: {
                updatePassword() {
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
    ],
        [StoreModule.forRoot({}), [RouterTestingModule.withRoutes([]),
        NativeScriptRouterModule.forRoot([])]]
    ));
    afterEach(nsTestBedAfterEach());


    beforeEach((async () => {
        fixture = await nsTestBedRender(CountryListComponent);
        component = fixture.componentInstance;
        mockStore = TestBed.get(Store);
        spy = spyOn(mockStore, 'dispatch');
        mockCoreSelector = mockStore.overrideSelector<CoreState, Partial<CoreState>>(coreState, {});
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on load component should set country and dispatch action to load countries', () => {
        const countries = testData.countries;
        mockCoreSelector.setResult({ countries });
        mockStore.refreshState();

        const payload = null;
        spy.and.callFake((action: ActionWithPayload<string>) => {
            expect(action.type).toEqual(UserActions.GET_COUNTRIES);
            expect(action.payload).toEqual(payload);
        });

        component.ngOnInit();

        const expectedCountries = [
            {
                'areaCode': null,
                'dialCode': '242',
                'flagClass': 'cg',
                'isoCode': 'cg',
                'name': 'Congo (Republic) (Congo-Brazzaville)',
                'priority': 0
            },
            {
                'areaCode': null,
                'dialCode': '593',
                'flagClass': 'ec',
                'isoCode': 'ec',
                'name': 'Ecuador',
                'priority': 0
            },
            {
                'areaCode': null,
                'dialCode': '1',
                'flagClass': 'pr',
                'isoCode': 'pr',
                'name': 'Puerto Rico',
                'priority': 3
            }
        ];
        expect(component.allCountries).toEqual(expectedCountries);
        expect(mockStore.dispatch).toHaveBeenCalled();

    });

    it('on call onItemTap it should close dialog and pass params', () => {
        const param = {
            'dialCode': '593',
            'flagClass': 'ec',
            'name': 'Ecuador',
        };

        const modalDialogParamsService = TestBed.get(ModalDialogParams);
        const spyOnCloseCallback = spyOn(modalDialogParamsService, 'closeCallback').and.returnValue('');
        component.onItemTap(param);
        expect(spyOnCloseCallback).toHaveBeenCalledTimes(1);
    });

    it('on call onClose it should close dialog', () => {

        const modalDialogParamsService = TestBed.get(ModalDialogParams);
        const spyOnCloseCallback = spyOn(modalDialogParamsService, 'closeCallback').and.returnValue('');
        component.onClose();
        expect(spyOnCloseCallback).toHaveBeenCalledTimes(1);
    });

});
