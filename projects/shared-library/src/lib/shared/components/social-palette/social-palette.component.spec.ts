import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialPaletteComponent } from './social-palette.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testData } from 'test/data';

describe('SocialPaletteComponent', () => {
    let component: SocialPaletteComponent;
    let fixture: ComponentFixture<SocialPaletteComponent>;
    let spy: any;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            declarations: [SocialPaletteComponent]
        });

        fixture = TestBed.createComponent(SocialPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Initial value of the isFromBlog and blogData should be falsy and blogUrl should be undefined', () => {
        expect(component.blogUrl).toBeUndefined();
        expect(component.isFromBlog).toBeFalsy();
        expect(component.blogData).toBeFalsy();
    });

    it('call to closeSocial should change share_status to false', () => {
        spy = spyOn(component.notify, 'emit');
        component.blogData = testData.blogs[0];
        component.closeSocial();
        expect(component.blogData.share_status).toBe(false);
        expect(component.notify.emit).toHaveBeenCalledWith(testData.blogs[0]);
    });

    it('call to ngOnChanges should set blogUrl', () => {
        component.blogData = testData.blogs[0];
        component.ngOnChanges();
        expect(component.blogUrl).toBe(testData.blogs[0].link);
    });

});
