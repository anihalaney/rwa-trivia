import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionsSearchComponent } from './questions-search.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { testData } from 'test/data';
import { Question, Category, SearchResults } from 'shared-library/shared/model';


describe('QuestionsSearchComponent', () => {
    let component: QuestionsSearchComponent;
    let fixture: ComponentFixture<QuestionsSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [],
            declarations: [QuestionsSearchComponent]
        });

        fixture = TestBed.createComponent(QuestionsSearchComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Initial value of the data should be falsy', () => {
        expect(component.questions).toBeFalsy();
        expect(component.totalCount).toBeFalsy();
        expect(component.categoryAggregation).toBeFalsy();
        expect(component.tagsCount).toBeFalsy();
        expect(component.totalCount).toBeFalsy();
        expect(component.tagsChecked).toBeFalsy();
    });

    it('call to getDisplayStatus should return the status of QuestionStatus', () => {
        const spy = spyOn(component, 'getDisplayStatus').and.callThrough();
        expect(component).toBeDefined();
        expect(spy);
        fixture.detectChanges();
        component.getDisplayStatus(2);
        expect(component.getDisplayStatus).toHaveBeenCalled();
    });

    it('call to approveButtonClicked should emit approveClicked event with question', () => {
        const question: Question = testData.questions.published[0];
        spyOn(component.approveClicked, 'emit');
        component.approveButtonClicked(question);
        expect(component.approveClicked.emit).toHaveBeenCalledWith(question);
    });

    it('call to pageChanged should emit onPageChanged event with pageEvent', () => {
        spyOn(component.onPageChanged, 'emit');
        const pageEvent = {
            pageIndex: 1,
            previousPageIndex: 0,
            pageSize: 20,
            length: 2
        };
        component.pageChanged(pageEvent);
        expect(component.onPageChanged.emit).toHaveBeenCalledWith(pageEvent);
    });

    it('call to categoryChanged should emit onCategoryChanged event with added and category id', () => {
        const event: MatCheckboxChange = { checked: true, source: null };
        const category: Category = { id: 1, categoryName: 'category-1', requiredForGamePlay: true, isSelected: true };
        spyOn(component.onCategoryChanged, 'emit');
        component.categoryChanged(event, category);
        expect(component.onCategoryChanged.emit).toHaveBeenCalledWith({ 'categoryId': category.id, 'added': event.checked });
    });

    it('call to tagChanged should emit onTagChanged event with add event and tag', () => {
        const event: MatCheckboxChange = { checked: true, source: null };
        const tag = '';
        spyOn(component.onTagChanged, 'emit');
        component.tagChanged(event, tag);
        expect(component.onTagChanged.emit).toHaveBeenCalledWith({ 'tag': tag, 'added': event.checked });
    });

    it('call to sortOrderChanged should emit onSortOrderChanged event with event', () => {
        const event = '';
        spyOn(component.onSortOrderChanged, 'emit');
        component.sortOrderChanged(event);
        expect(component.onSortOrderChanged.emit).toHaveBeenCalledWith(event);
    });

    it('verify that questions,totalCount,categoryAggregation,tagsCount, tagsChecked should be set on ngOnChanges', () => {

        const questionsSearchResults: SearchResults = {
            questions: testData.questions.published,
            totalCount: 20,
            searchCriteria: {
                categoryIds: [1, 2, 3],
                tags: ['Typescript', ''],
                status: 'APPROVED',
                searchInput: 'Typ',
                sortOrder: ''
            },
            categoryAggregation: { 20: 20 },
            tagsCount: [{ tag: 'Typescript', count: 20 }]
        };
        component.questionsSearchResults = questionsSearchResults;
        component.ngOnChanges();
        expect(component.questions).toEqual(questionsSearchResults.questions);
        expect(component.totalCount).toEqual(questionsSearchResults.totalCount);
        expect(component.categoryAggregation).toEqual(questionsSearchResults.categoryAggregation);
        expect(component.tagsCount).toEqual(questionsSearchResults.tagsCount);
    });

});
