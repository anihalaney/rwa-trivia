import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { QuestionComponent } from './question.component';
import { StoreModule, Store } from '@ngrx/store';
import { TEST_DATA } from '../../testing/test.data';
import { Question, Answer } from '../../../../../shared-library/src/lib/shared/model';
import { QuestionActions } from '../../../../../shared-library/src/lib/core/store/actions';
import { UserActions } from '../../../../../shared-library/src/lib/core/store/actions';
import { AuthorComponent } from '../../../../../shared-library/src/lib/shared/components/author/author.component';

describe('Component: QuestionComponent', () => {

    let component: QuestionComponent;
    let fixture: ComponentFixture<QuestionComponent>;
    let _store: any;
    let spy: any;


    beforeEach(() => {

        // refine the test module by declaring the QuestionComponent component
        TestBed.configureTestingModule({
            imports: [StoreModule.forRoot({})],
            providers: [Store, QuestionActions, UserActions],
            declarations: [QuestionComponent, AuthorComponent]
        });

        // create component and QuestionComponent fixture
        fixture = TestBed.createComponent(QuestionComponent);

        // get the injected instances
        _store = fixture.debugElement.injector.get(Store);

        // get QuestionComponent component from the fixture
        component = fixture.componentInstance;

        component.userDict = TEST_DATA.userDict;
        component.question = TEST_DATA.questions.published.filter(obj => { return obj.id === '1' })[0];
        fixture.detectChanges();
        component.ngOnChanges();

        // get the injected instances
        _store = fixture.debugElement.injector.get(Store);

    });
    it('Click on answer option', () => {
        const answer: Answer = component.question.answers.filter(obj => { return obj.id === 1 })[0];
        component.answeredText = answer.answerText;
        expect(component.answeredText).toBeDefined();
        component.answerButtonClicked(answer);
    });
    it('Click on Try Another Button', () => {

        spy = spyOn(_store, 'dispatch');

        spy.and.callFake((action: any) => {
            expect(action.getQuestionOfTheDay);
        });
        component.getNextQuestion();
        expect(_store.dispatch).toHaveBeenCalled();

    });
});
