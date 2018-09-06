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
  bulkUploadId?: string;
  reason?: string;
  validationErrorMessages?: string[];
  userGivenAnswer?: string;
  addedOn?: number;
  gameRound?: number;

  static getViewModelFromDb(db: any): Question {
    const question: Question = new Question();
    question.id = db.id;
    question.answers = db.answers;
    question.categoryIds = db.categoryIds;
    question.published = db.published;
    question.questionText = db.questionText;
    question.status = db.status;
    question.tags = db.tags;
    question.created_uid = db.created_uid;
    question.ordered = db.ordered;
    question.categories = db.categories;
    question.approved_uid = db.approved_uid;
    question.explanation = db.explanation;
    question.bulkUploadId = db.bulkUploadId ? db.bulkUploadId : '';
    question.reason = db.reason ? db.reason : '';
    question.createdOn = db.createdOn ? db.createdOn : new Date();
    return question;
  }

  static getViewModelFromES(hit: any): Question {
    const question: Question = new Question();
    question.id = hit['_id'];
    const source = hit['_source'];
    const orderedAnswers: Answer[] = [];

    question.answers = this.changeAnswerOrder(source.answers, orderedAnswers);

    question.categoryIds = source.categoryIds;
    question.published = source.published;
    question.questionText = source.questionText;
    question.status = source.status;
    question.tags = source.tags;
    question.created_uid = source.created_uid;

    return question;
  }

  static changeAnswerOrder(answers: Answer[], orderedAnswers: Answer[]) {
    if (orderedAnswers.length !== 4) {
      const randomIndex = Math.floor(Math.random() * 4);
      if (orderedAnswers.indexOf(answers[randomIndex]) === -1) {
        orderedAnswers.push(answers[randomIndex]);
      }
      this.changeAnswerOrder(answers, orderedAnswers);
    }
    return orderedAnswers;
  }

  constructor() {
    this.id = '';
    this.answers = [new Answer(), new Answer(), new Answer(), new Answer()];
    this.ordered = false;
    this.tags = [];
    this.categories = [];
    this.categoryIds = [];
    this.published = false;
    this.status = QuestionStatus.SAVED;
    this.validationErrorMessages = [];
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
  INACTIVE,
  PENDING,
  REJECTED,
  REQUIRED_CHANGE
}
