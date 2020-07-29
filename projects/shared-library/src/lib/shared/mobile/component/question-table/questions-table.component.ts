import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges, ViewChild
} from '@angular/core';
import { Question, QuestionStatus, Category, User, Answer } from '../../../../shared/model';
import { Observable } from 'rxjs';
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { ListViewItemSnapMode } from 'nativescript-ui-listview';
import { isIOS } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.css']
})

export class QuestionsTableComponent implements OnInit, OnChanges {

  QuestionStatusTexts = ['', '', '&#xf00c;', '', '&#xf251;', '&#xf00d;', '&#xf044;'];
  @Input() questions: Array<Question> = [];
  @Input() categoryDictionary: { [key: number]: Category };
  @Input() userDict: { [key: string]: User };
  @Input() user: User;
  @Input() tagsObs: Observable<string[]>;
  @Input() categoriesObs: Observable<Category[]>;
  @Input() displayReasonViewer: boolean;
  @Output() displayReason: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedQuestion: EventEmitter<Question> = new EventEmitter<Question>();
  @Output() editQuestion: EventEmitter<Question> = new EventEmitter<Question>();

  @ViewChild('listview', { static: true }) radListView: RadListViewComponent;
  showQuestionId = '';
  counter = 0;
  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cd.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['questions'] && this.questions && (!changes['questions'].currentValue ||
      (changes['questions'] && changes['questions'].currentValue && changes['questions'].currentValue !== changes['questions'].previousValue)
    )) {
      this.questions.map(data => data['show'] = false);
    }
  }

  expandQuestion(args: string, isShow: boolean, qIndex = -1) {
    const questionObj = [...this.questions];
    questionObj.map(data => {
      data['show'] = false;
      if (data.id === args) {
        data['show'] = isShow;
      }
    });
    if (qIndex > -1 && isIOS) {
      this.questions = [...questionObj];
      // wait for the UI to finish the loading
      setTimeout(() => {
        this.scrollToIndex(qIndex);
      }, 0);
    }
    this.showQuestionId = args;
  }

  scrollToIndex(index) {
    if (this.radListView.listView) {
      this.radListView.listView.scrollToIndex(index, true, ListViewItemSnapMode.Start);
    }
  }

  setHeight(height: number, id: string) {
    const index = this.questions.findIndex((data) => data.id === id);
    const questionObj = this.questions[index];
    if (!questionObj['height']) {
      questionObj['height'] = height;
      this.questions = [
        ...this.questions.slice(0, index),
        {
          ...this.questions[index],
          ...{ height: height },
        },
        ...this.questions.slice(index + 1),
      ];
    }
  }

  setAnsHeight(height: number, id: string, index: number, qIndex: number) {
    const questionIndex = this.questions.findIndex((data) => data.id === id);
    if (this.questions[questionIndex].answers[index] && !this.questions[questionIndex].answers[index]['height']) {
      this.questions[questionIndex].answers[index]['height'] = height;
      if (!this.questions[questionIndex].answers.some(data => !data['height'])) {
        this.questions = [
          ...this.questions.slice(0, questionIndex),
          {
            ...this.questions[questionIndex]
          },
          ...this.questions.slice(questionIndex + 1),
        ];
        if (qIndex > -1 && isIOS) {
          // wait for the UI to finish the loading
          setTimeout(() => {
            // this.radListView.listView.scrollToIndex(qIndex, true, ListViewItemSnapMode.Start);
          }, 0);
        }
      }
    }
  }

  hideData() {
    this.showQuestionId = '';
    this.cd.markForCheck();
  }
  getDisplayStatus(status: number): string {
    return QuestionStatus[status];
  }

  getOtherOptionsString(answers: Answer[]): string {
    const optionValues = [];
    answers.map(answer => {
      if (!answer.correct) {
        optionValues.push(answer.answerText);
      }
    });
    return optionValues.join(',');
  }

  showReason(question: Question) {
    this.displayReasonViewer = true;
    this.displayReason.next(this.displayReasonViewer);
    this.selectedQuestion.next(question);
  }

  showEditQuestion(question: Question) {
    this.editQuestion.next(question);
  }
}

