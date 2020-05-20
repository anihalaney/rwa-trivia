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

    it('Initial value of the data should be falsy', () => {
        expect(component.blogUrl).toBeUndefined();
        expect(component.isFromBlog).toBeFalsy();
        expect(component.blogData).toBeFalsy();
    });

    it('call to closeSocial should change share_status to false', () => {
        component.blogData = testData.blogs[0];
        component.blogData.share_status = false;
        spyOn(component.notify, 'emit');
        fixture.detectChanges();
        component.closeSocial();
        expect(component.notify.emit).toHaveBeenCalledWith(component.blogData);
    });

    it('call to ngOnChanges should set blogUrl', () => {
        spy = spyOn(component, 'ngOnChanges').and.callThrough();
        expect(component).toBeDefined();
        expect(spy);
        component.blogData = testData.blogs[0];
        this.blogUrl = component.blogData.link;
        fixture.detectChanges();
        component.ngOnChanges();
        expect(component.ngOnChanges).toHaveBeenCalled();
    });
});
