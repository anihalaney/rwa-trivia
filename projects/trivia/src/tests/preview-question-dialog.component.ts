import 'reflect-metadata';
// tslint:disable-next-line: max-line-length
import { PreviewQuestionDialogComponent } from '../app/user/components/question-add-update/preview-question-dialog/preview-question-dialog.component.tns';
import { nsTestBedBeforeEach, nsTestBedAfterEach, nsTestBedRender } from 'nativescript-angular/testing';
import { ComponentFixture } from '@angular/core/testing';
import { testData } from 'test/data';

describe('PreviewQuestionDialogComponent', () => {

    let component: PreviewQuestionDialogComponent;
    let fixture: ComponentFixture<PreviewQuestionDialogComponent>;

    afterAll(() => { });
    beforeEach(nsTestBedBeforeEach([PreviewQuestionDialogComponent], [], []));

    beforeEach((async () => {
        fixture = await nsTestBedRender(PreviewQuestionDialogComponent);
        component = fixture.componentInstance;
    }));
    afterEach(nsTestBedAfterEach(true));
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('on OnChange it should set category', () => {
        expect(component).toBeTruthy();
        component.categoryDictionary = testData.categoryList;
        component.question = testData.question;
        component.ngOnChanges({
            question:
            {
                previousValue: undefined,
                currentValue: true,
                firstChange: true,
                isFirstChange: undefined
            }
        });
        console.log(component.categoryName);
        expect(component.categoryName).toBe('Programming');
    });
});
