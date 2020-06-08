import { LocationResetDialogComponent } from './location-reset-dialog.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';

describe('LocationResetDialogComponent', () => {
    let component: LocationResetDialogComponent;
    let fixture: ComponentFixture<LocationResetDialogComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LocationResetDialogComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [MatDialogModule],
            providers: [
                {
                    provide: MatDialogRef, userValue: {}
                }
            ]
        });
    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(LocationResetDialogComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('Should create', () => {
        expect(component).toBeTruthy();
    });

    it('Verify closeModel function it should call dialog close method', () => {
        component.dialogRef = { close: function () { } } as any;
        component.dialogRef.close = jest.fn();
        component.closeModel();

        expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });
});
