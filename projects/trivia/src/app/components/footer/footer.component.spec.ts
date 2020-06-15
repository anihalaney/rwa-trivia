import { FooterComponent } from './footer.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { WindowRef } from 'shared-library/core/services';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardConstants } from 'shared-library/shared/model';
import { projectMeta } from 'shared-library/environments/environment';
import { testData } from 'test/data';

describe('FooterComponent', () => {

    let component: FooterComponent;
    let fixture: ComponentFixture<FooterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FooterComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule.withRoutes([])],
            providers: [
                WindowRef
            ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(FooterComponent);

        component = fixture.debugElement.componentInstance;
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('On load component should set hostName', () => {
        const hostName = `${component.windowRef.nativeWindow.location.protocol}//${component.windowRef.nativeWindow.location.hostname}/${DashboardConstants.ADMIN_ROUTE}`;

        expect(component.hostname).toEqual(hostName);
    });

    it('On load component should set user', () => {
        component.user = { ...testData.userList[0] };

        expect(component.user).not.toBeUndefined();
    });

    it('On load component should set blogUrl, playstoreUrl and appStoreUrl', () => {
        expect(component.blogUrl).toEqual(projectMeta.blogUrl);
        expect(component.playstoreUrl).toEqual(projectMeta.playStoreUrl);
        expect(component.appStoreUrl).toEqual(projectMeta.appStoreUrl);
    });
});
