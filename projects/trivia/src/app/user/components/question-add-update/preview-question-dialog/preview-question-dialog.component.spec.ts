import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewQuestionDialogComponent } from './preview-question-dialog.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material';
import { testData } from 'test/data';

describe('PreviewQuestionDialogComponent', () => {

    let component: PreviewQuestionDialogComponent;
    let fixture: ComponentFixture<PreviewQuestionDialogComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PreviewQuestionDialogComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: {}
                },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {question: testData.questions.published[0]}
                },
            ],
            imports: [ MatSnackBarModule ]
        });

    }));

    beforeEach(() => {
        // create component
        fixture = TestBed.createComponent(PreviewQuestionDialogComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set data for question', () => {
        expect(component.question).toEqual(testData.questions.published[0]);
    });

    it('verify closeModel function should work correctly', () => {
        component.dialogRef.close = jest.fn();
        component.closeModel();
        expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
    });

    afterEach(() => {
        fixture.destroy();
    });

});
