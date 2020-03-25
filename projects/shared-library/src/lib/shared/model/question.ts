import { Category } from './category';

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
  badge?: { name: string, won: boolean};
  addedOn?: number;
  gameRound?: number;
  totalQALength?: number;
  serverTimeQCreated?: number;
  renderedQuestion?: any;
  renderedAnswer?; any;
  questionObject?: any;
  isRichEditor?: boolean = false;
  maxTime?: number;
  is_draft: boolean;
  appeared: number;
  correct: number;
  wrong: number;
  height?: number;
  reactionsCount?: { [key: string]: number };
  stats:  {
    appeared: number;
    correct: number;
    wrong: number;
    reactionsCount?: { [key: string]: number };
  }




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
    question.isRichEditor = db.isRichEditor ? db.isRichEditor : false;
    question.questionObject = db.questionObject ? db.questionObject : false;
    question.createdOn = db.createdOn ? db.createdOn : new Date();
    question.totalQALength = this.countQALength(db);
    question.maxTime = db.maxTime ? db.maxTime : 0;
    question.reactionsCount  = db.reactionsCount ? db.reactionsCount : {};
    question.is_draft  = db.is_draft ? db.is_draft : false;

    question.appeared = db.appeared ? db.appeared : 0;
    question.correct = db.correct ? db.correct : 0;
    question.wrong = db.wrong ? db.wrong : 0;
    question.stats = db.stats ? db.stats : {};
    db.answers = db.answers.map(answer => {
      answer.isRichEditor = answer.isRichEditor ? answer.isRichEditor : false;
      return answer;
    });
    return question;
  }

  static getViewModelFromES(hit: any): Question {
    const question: Question = new Question();
    question.id = hit['_id'];
    const source = hit['_source'];

    question.answers = source.answers;

    question.categoryIds = source.categoryIds;
    question.published = source.published;
    question.questionText = source.questionText;
    question.status = source.status;
    question.tags = source.tags;
    question.created_uid = source.created_uid;
    question.serverTimeQCreated = source.serverTimeQCreated;
    question.renderedQuestion = source.renderedQuestion;
    question.isRichEditor = (source.isRichEditor) ? source.isRichEditor : false;
    question.questionObject = (source.questionObject) ? source.questionObject : '' ;
    question.reactionsCount = (source.reactionsCount) ? source.reactionsCount : {} ;
    question.appeared = source.appeared ? source.appeared : 0;
    question.correct = source.correct ? source.correct : 0;
    question.wrong = source.wrong ? source.wrong : 0;
    question.stats = source.stats ? source.stats : {};

    question.totalQALength = this.countQALength(source);
    return question;
  }

  static countQALength(question: any) {
    return question.questionText && question.questionText.length ? question.questionText.length : 0
      + (question.answers[0] && question.answers[0].answerText && question.answers[0].answerText.length ? question.answers[0].answerText.length : 0 )
      + (question.answers[1] && question.answers[1].answerText && question.answers[1].answerText.length ? question.answers[1].answerText.length : 0)
      + (question.answers[2] && question.answers[2].answerText && question.answers[2].answerText.length ? question.answers[2].answerText.length : 0)
      + (question.answers[3] && question.answers[3].answerText && question.answers[3].answerText.length ? question.answers[3].answerText.length : 0);
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
  renderedAnswer?: string;
  answerObject?: any;
  isRichEditor?: boolean = false;
  height?: number;
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
