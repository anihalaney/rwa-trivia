import { Category } from './category'

export class Question {
  id: string;
  questionText: string;
  answers: Answer[];
  ordered: boolean;
  explanation?: string;
  tags: string[];
  categories?: Category[];
  categoryIds: number[];
  published?: boolean;
  status?: QuestionStatus;
  created_uid?: string;
  createdOn?: Date;
  lastUpdated_uid?: string;
  lastUpdatedOn?: Date;
  approved_uid?: string;
  approvedOn?: Date;
  
  constructor() {
    this.id = "";
    this.answers = [new Answer(), new Answer(), new Answer(), new Answer()];
    this.ordered = false;
    this.tags = [];
    this.categories = [];
    this.categoryIds = [];
    this.published = false;
    this.status = QuestionStatus.SAVED;
  }

  static getViewModelFromES(hit: any): Question 
  {
    //console.log(dbModel);
    let question: Question = new Question();

    question.id = hit["_id"];
    let source = hit["_source"];

    question.answers = source.answers;
    question.categoryIds = source.categoryIds;
    question.published = source.published;
    question.questionText = source.questionText;
    question.status = source.status;
    question.tags = source.tags;
    
    //console.log(game);
    return question;
  }

}

export class Answer {
  id: number;
  answerText: string;
  correct: boolean;
}

export enum QuestionStatus {
  SAVED,
  SUBMITTED,
  APPROVED,
  INACTIVE
}
