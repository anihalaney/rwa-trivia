import {
  Component, Input
} from '@angular/core';
import { Question, QuestionStatus, Category, User, Answer } from '../../../../shared/model';
import { Utils } from '../../../../core/services';
import { Observable } from 'rxjs';


@Component({
  selector: 'question-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.css']
})

export class QuestionsTableComponent {


  @Input() questions: Question[];
  @Input() categoryDictionary: { [key: number]: Category };
  @Input() userDict: { [key: string]: User };
  @Input() user: User;
  @Input() tagsObs: Observable<string[]>;
  @Input() categoriesObs: Observable<Category[]>;
  // @Output() updateUnpublishedQuestions = new EventEmitter<Question>();



  constructor() {
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

  updateQuestionData(question: Question) {
    //  this.updateUnpublishedQuestions.emit(question);
  }
}

