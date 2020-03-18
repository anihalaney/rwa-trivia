import { Input, Output, EventEmitter } from '@angular/core';
import { Question, Answer, User, ApplicationSettings, userCardType, PlayerMode, Game } from 'shared-library/shared/model';

export class GameQuestion {
  @Input() questionIndex: number;
  @Input() question: Question;
  @Input() categoryName: string;
  @Input() timer: number;
  @Input() continueNext: boolean;
  @Input() correctCount: number;
  @Input() questionRound: number;
  @Input() noOfQuestions: number;
  @Input() showContinueBtn: boolean;
  @Input() otherPlayer: User;
  @Input() totalRound: number;
  @Output() answerClicked = new EventEmitter<number>();
  @Output() okClick = new EventEmitter();
  @Output() continueClicked = new EventEmitter();
  @Output() viewQuestionClicked = new EventEmitter();
  @Input() turnFlag: boolean;
  @Input() threeConsecutiveAnswer: boolean;
  @Input() userDict: { [key: string]: User };
  @Input() MAX_TIME_IN_SECONDS: number;
  @Input() applicationSettings: ApplicationSettings;
  @Input() user: User;
  @Input() playerMode: any;
  @Input() showCurrentQuestion: boolean;
  @Output() gameOverButtonClicked = new EventEmitter();
  @Input() gameOver: boolean;
  @Output() btnClickedAfterThreeConsecutiveAnswers = new EventEmitter();
  @Input() earnedBadgesByOtherUser: string[];
  @Input() earnedBadges: string[];
  @Input() game: Game;
  @Input() totalBadges: string[];
  showLoader = false;

  answeredIndex: number;
  correctAnswerIndex: number;
  answeredText: string;
  userCardType = userCardType;
  PlayerMode = PlayerMode;
  // applicationSettings: ApplicationSettings;

  doPlay = true;

  constructor() {
  }

  answerButtonClicked(answer: Answer, index: number) {
    if (this.doPlay) {
      if (this.answeredIndex >= 0 || this.continueNext) {
        return;
      }
      this.answeredText = answer.answerText;
      this.doPlay = false;
      this.answeredIndex = index;
      this.answerClicked.emit(index);
    }

  }

  disableQuestions(correctAnswerIndex: number) {
    this.doPlay = false;
    this.correctAnswerIndex = correctAnswerIndex;
  }

  continueButtonClicked(event) {
    if (this.showContinueBtn) {
      this.continueClicked.emit(event);
    }
      this.showLoader = true;
  }

  fillTimer() { }
}
