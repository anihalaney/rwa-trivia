import {
  Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef
} from '@angular/core';
import { Question, QuestionStatus, Category, User, Answer } from '../../../../shared/model';
import { Observable } from 'rxjs';

@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.css']
})

export class QuestionsTableComponent implements OnInit {

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
  showQuestionId = '';
  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.cd.markForCheck();
  }

  onSelect(args) {
    this.showQuestionId = args;
    this.cd.markForCheck();
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

