import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { AppStore } from '../../store/app-store';
import { QuestionActions } from '../../store/actions';
import { Category, Question, Answer }     from '../../model';

@Component({
  templateUrl: './question-add-update.component.html',
  styleUrls: ['./question-add-update.component.scss']
})
export class QuestionAddUpdateComponent implements OnInit, OnDestroy {

  tagsObs: Observable<string[]>;
  categoriesObs: Observable<Category[]>;

  //Properties
  categories: Category[];
  sub: any;

  tags: string[];
  sub2: any;

  questionForm: FormGroup;
  question: Question;
  
  autoTags: string[] = []; //auto computed based on match within Q/A
  enteredTags: string[] = [];

  get answers(): FormArray { 
    return this.questionForm.get('answers') as FormArray; 
  }
  get tagsArray(): FormArray { 
    return this.questionForm.get('tagsArray') as FormArray; 
  }

  //Constructor
  constructor(private fb: FormBuilder,
              private store: Store<AppStore>,
              private questionActions: QuestionActions) {
    this.categoriesObs = store.select(s => s.categories);
    this.tagsObs = store.select(s => s.tags);
  }

  //Lifecycle hooks
  ngOnInit() {
    this.question = new Question();
    this.createForm(this.question);

    let questionControl = this.questionForm.get('questionText');

    questionControl.valueChanges.debounceTime(500).subscribe(v => this.computeAutoTags());
    this.answers.valueChanges.debounceTime(500).subscribe(v => this.computeAutoTags());

    this.sub = this.categoriesObs.subscribe(categories => this.categories = categories);
    this.sub2 = this.tagsObs.subscribe(tags => this.tags = tags);

  }

  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe();
    if (this.sub2)
      this.sub2.unsubscribe();
  }

  //Event Handlers
  addTag() {
    let tag = this.questionForm.get('tags').value;
    if (tag) {
      if (this.enteredTags.indexOf(tag) < 0)
        this.enteredTags.push(tag);
      this.questionForm.get('tags').setValue('');
    }
    this.setTagsArray();
  }
  removeEnteredTag(tag) {
    this.enteredTags = this.enteredTags.filter(t => t !== tag); 
    this.setTagsArray();
  }
  onSubmit() {
    //validations
    this.questionForm.updateValueAndValidity();
    if (this.questionForm.invalid)
      return;

    //get question object from the forms
    console.log(this.questionForm.value);
    let question: Question = this.getQuestionFromFormValue(this.questionForm.value);
    console.log(question);

    //call saveQuestion
    this.saveQuestion(question);
  }
  
  //Helper functions
  getQuestionFromFormValue(formValue: any): Question {
    let question: Question;

    question = new Question();
    question.questionText = formValue.questionText;
    question.answers = formValue.answers;
    question.categoryIds = [formValue.category];
    question.tags = [...this.autoTags, ...this.enteredTags]
    question.ordered = formValue.ordered;
    question.explanation = formValue.explanation;

    return question;
  }

  saveQuestion(question: Question) {
    this.store.dispatch(this.questionActions.addQuestion(question));
  }

  computeAutoTags() {
    let formValue = this.questionForm.value;

    let allTextValues: string[] = [formValue.questionText];
    formValue.answers.forEach(answer => allTextValues.push(answer.answerText));

    let wordString: string = allTextValues.join(" ");

    let matchingTags: string[] = [];
    this.tags.forEach(tag => {
      let patt = new RegExp('\\b(' + tag.replace("+", "\\+") + ')\\b', "ig");
      if (wordString.match(patt))
        matchingTags.push(tag);
    });
    this.autoTags = matchingTags;

    this.setTagsArray();
  }
  setTagsArray() {
    this.tagsArray.controls = [];
    [...this.autoTags, ...this.enteredTags].forEach(tag => this.tagsArray.push(new FormControl(tag)));
  }
  createForm(question: Question) {

    let fgs:FormGroup[] = question.answers.map(answer => {
      let fg = new FormGroup({
        answerText: new FormControl(answer.answerText, Validators.required),
        correct: new FormControl(answer.correct),
      });
      return fg;
    });
    let answersFA = new FormArray(fgs);

    let fcs:FormControl[] = question.tags.map(tag => {
      let fc = new FormControl(tag);
      return fc;
    });
    if (fcs.length == 0)
      fcs = [new FormControl('')];
    let tagsFA = new FormArray(fcs);

    this.questionForm = this.fb.group({
      category: [(question.categories.length>0? question.categories[0] : ''), Validators.required],
      questionText: [question.questionText, Validators.required],
      tags: '',
      tagsArray: tagsFA,
      answers: answersFA,
      ordered: [question.ordered],
      explanation: [question.explanation]
      }, {validator: questionFormValidator}
    );
  }

}

//Custom Validators
function questionFormValidator(fg: FormGroup): {[key: string]: boolean} {
  let answers: Answer[] = fg.get('answers').value;
  if (answers.filter(answer => answer.correct).length !== 1)
    return {'correctAnswerCountInvalid': true}

  let tags: string[] = fg.get('tagsArray').value;
  if (tags.length  < 3)
    return {'tagCountInvalid': true}

  return null;
}
