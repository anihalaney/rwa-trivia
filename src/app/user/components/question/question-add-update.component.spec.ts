import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DebugElement }    from '@angular/core';
import { ReactiveFormsModule }    from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { SharedMaterialModule } from '../../../shared/shared-material.module';
import { Store } from '@ngrx/store';

import { TEST_DATA } from '../../../testing/test.data';
import { MockStore } from '../../../testing/mock-store';
import { QuestionActions } from '../../../core/store/actions';
import { QuestionAddUpdateComponent } from './question-add-update.component';
import { Category, Question, QuestionStatus }     from '../../../model';

describe('Component: QuestionAddUpdateComponent', () => {

  let comp: QuestionAddUpdateComponent;
  let fixture: ComponentFixture<QuestionAddUpdateComponent>;
  let de: DebugElement;
  let _titleEl: HTMLElement;
  let _store: any;

  //Define intial state and test state
  let _initialState = {categories: [], tags: [], user: {}};
  let _user = TEST_DATA.userList[0];
  let _testState = {categories: TEST_DATA.categories, tags: TEST_DATA.tagList, user: _user};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAddUpdateComponent ], // declare the test component
      imports: [
        NoopAnimationsModule,
        //Material
        SharedMaterialModule,
        ReactiveFormsModule
      ],
      providers:[
        QuestionActions,
        {provide:Store, useValue: new MockStore(_initialState)}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionAddUpdateComponent);

    //get the injected instances
    _store = fixture.debugElement.injector.get(Store);
    
    comp = fixture.componentInstance; // Component test instance

    // query for the title by CSS element selector
    de = fixture.debugElement.query(By.css('mat-card-title'));
    _titleEl = de.nativeElement;

    //_categoryListEl = fixture.debugElement.query(By.css('mat-list')).nativeElement;
  }));

  it('Display Add Question title', () => {
    fixture.detectChanges();
    expect(_titleEl.textContent).toContain("Add Question");
  });

  it('Init', () => {
    _store.next(_testState);
    comp.ngOnInit();

    fixture.detectChanges();
    expect(comp.categories).toEqual(TEST_DATA.categories);
    expect(comp.tags).toEqual(TEST_DATA.tagList);

    expect(typeof comp.question).toEqual('object'); //question instantiated

    let form = comp.questionForm;
    expect(comp.answers.length).toEqual(4); //form has 4 answers
    
    let categorySelectEl = fixture.debugElement.query(By.css("mat-select[name='category']")).nativeElement;
    //expect(categorySelectEl.childElementCount).toEqual(TEST_DATA.categories.length);

  });

  it('Validations', () => {
    _store.next(_testState);
    comp.ngOnInit();

    fixture.detectChanges();
    let form = comp.questionForm;

    expect(form.valid).toEqual(false);
    
    //Category is required
    expect(form.get('category').valid).toEqual(false);
    form.get('category').setValue(comp.categories[2]);
    expect(form.get('category').valid).toEqual(true);
    
    //Question Text is required
    expect(form.get('questionText').valid).toEqual(false);
    form.get('questionText').setValue("Test Question");
    expect(form.get('questionText').valid).toEqual(true);
    expect(form.valid).toEqual(false);
    
    //All 4 answers are required
    expect(comp.answers.valid).toEqual(false);
    comp.answers.controls[0].get("answerText").setValue("1st answer");
    comp.answers.controls[1].get("answerText").setValue("2nd answer");
    expect(comp.answers.valid).toEqual(false);
    comp.answers.controls[2].get("answerText").setValue("3rd answer");
    comp.answers.controls[3].get("answerText").setValue("4th answer");
    expect(comp.answers.valid).toEqual(true);
    expect(form.valid).toEqual(false);
    
    //One correct answer
    comp.answers.controls[2].get("correct").setValue(true);
    expect(form.valid).toEqual(false);

    //3 tags needed
    comp.tagsArray.push(new FormControl("Tag 1"));
    comp.tagsArray.push(new FormControl("Tag 2"));
    comp.tagsArray.push(new FormControl("Tag 3"));

    expect(form.valid).toEqual(true);
  });

  it('computeAutoTags', () => {
    _store.next(_testState);
    comp.ngOnInit();

    fixture.detectChanges();
    let form = comp.questionForm;

    comp.computeAutoTags();
    expect(comp.autoTags.length).toEqual(0);

    form.get('questionText').setValue("What is Javascript ?");
    comp.computeAutoTags();
    expect(comp.autoTags.length).toEqual(1);
    expect(comp.autoTags[0].toLocaleLowerCase()).toEqual("Javascript".toLocaleLowerCase());
    expect(comp.tagsArray.length).toEqual(comp.autoTags.length);

    comp.answers.controls[0].get("answerText").setValue("Compiler language");
    comp.answers.controls[1].get("answerText").setValue("runs native on iOS or Android");
    comp.answers.controls[2].get("answerText").setValue("same as Java");
    comp.answers.controls[3].get("answerText").setValue("same as Ecmascript");
    comp.computeAutoTags();
    //console.log(comp.autoTags);
    expect(comp.autoTags.length).toBeGreaterThan(1);
    expect(comp.autoTags.findIndex(a => a == "Java")).toBeGreaterThan(0);
    expect(comp.tagsArray.length).toEqual(comp.autoTags.length);
  })

  it('addTag', () => {
    _store.next(_testState);
    comp.ngOnInit();

    fixture.detectChanges();
    let form = comp.questionForm;

    //let tagInputEl = fixture.debugElement.query(By.css("input[formControlName='tags']")).nativeElement;
    //tagInputEl.textContent = "smartphone"
    form.get('tags').setValue("smartphone");
    let addTagButton  = fixture.debugElement.query(By.css("button.add-tag-button")); // find add tag button
    addTagButton.triggerEventHandler('click', null);
    
    expect(comp.tagsArray.length).toEqual(1);
    expect(comp.tagsArray.controls[0].value).toEqual("smartphone");
    expect(form.get('tags').value).toEqual("");
  })

  it('submit form', () => {
    _store.next(_testState);
    comp.ngOnInit();

    fixture.detectChanges();
    let form = comp.questionForm;

    expect(form.valid).toEqual(false);
    
    //Category is required
    expect(form.get('category').valid).toEqual(false);
    form.get('category').setValue(comp.categories[2]);
    expect(form.get('category').valid).toEqual(true);
    
    //Question Text is required
    expect(form.get('questionText').valid).toEqual(false);
    form.get('questionText').setValue("Test Question");
    expect(form.get('questionText').valid).toEqual(true);
    expect(form.valid).toEqual(false);
    
    //All 4 answers are required
    expect(comp.answers.valid).toEqual(false);
    comp.answers.controls[0].get("answerText").setValue("1st answer");
    comp.answers.controls[1].get("answerText").setValue("2nd answer");
    expect(comp.answers.valid).toEqual(false);
    comp.answers.controls[2].get("answerText").setValue("3rd answer");
    comp.answers.controls[3].get("answerText").setValue("4th answer");
    expect(comp.answers.valid).toEqual(true);
    expect(form.valid).toEqual(false);
    
    //One correct answer
    comp.answers.controls[2].get("correct").setValue(true);
    expect(form.valid).toEqual(false);

    //3 tags needed
    comp.tagsArray.push(new FormControl("Tag 1"));
    comp.tagsArray.push(new FormControl("Tag 2"));
    comp.tagsArray.push(new FormControl("Tag 3"));

    expect(form.valid).toEqual(true);

    //spy on store's dispatch action to ensure ADD_QUESTION action is dispatched with the question
    spyOn(_store, 'dispatch')
          .and.callFake((action: any) => {
            expect(action.type).toEqual(QuestionActions.ADD_QUESTION);
            expect(action.payload.created_uid).toEqual(_user.userId);
            expect(action.payload.questionText).toEqual("Test Question");
            expect(action.payload.status).toEqual(QuestionStatus.SUBMITTED);
          });

    comp.onSubmit()
    expect(_store.dispatch).toHaveBeenCalled();
  })

});