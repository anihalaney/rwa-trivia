import { Component, Input, OnInit } from '@angular/core';

import { Question } from '../../../model';

@Component({
  selector: 'question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent {
  @Input() question: Question;
}
