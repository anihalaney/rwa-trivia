import { HeaderComponent } from './header.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { testData } from 'test/data';
import { projectMeta } from 'shared-library/environments/environment';

describe('HeaderComponent', () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: ActivatedRoute, useValue: {
                        params: of(
                            {
                                category: 'id_query_params_test'
                            }
                        )
                    }
                }
            ],
            imports: [MatSnackBarModule, RouterTestingModule.withRoutes([])]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        // mock data

        component = fixture.debugElement.componentInstance;
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('`@input user` should set on load component', () => {
        component.user = testData.userList[0];

        expect(component.user).not.toBeUndefined();
    });

    it('On load component should set projectMeta data', () => {
        component.projectMeta = projectMeta;

        expect(component.projectMeta).not.toBeUndefined();
    });

    it('Verify navigateUrl function it should call router.navigate method', () => {
        component.user = testData.userList[0];
        const navigateSpy = spyOn(component.router, 'navigate');
        component.navigateUrl();

        expect(navigateSpy).toHaveBeenCalledTimes(1);
        expect(navigateSpy).toHaveBeenCalledWith(['user/my/profile', testData.userList[0].userId]);
    });
});
