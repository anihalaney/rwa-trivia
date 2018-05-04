
import { Game, Question, Category, User, UserStatConstants, Invitation, TriggerConstants } from '../src/app/model';
import { ESUtils } from './ESUtils';
import { GameLeaderBoardStats } from './game-leader-board-stats';
import { UserContributionStat } from './user-contribution-stat';
import { MailClient } from './mail-client';
const TinyURL = require('tinyurl');
const fs = require('fs');
const path = require('path');
const mailConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../config/mail.config.json'), 'utf8'));

const admin = require('firebase-admin');
admin.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG), 'secondary');
const functions = require('firebase-functions');

exports.onQuestionWrite = functions.firestore.document('/questions/{questionId}').onWrite((change, context) => {
  //exports.onQuestionWrite = functions.database.ref('/questions/published/{questionId}').onWrite(event => {
  //console.log(event);
  //console.log(event.data);
  //console.log(event.data.data());

  //console.log(event.params);
  //console.log(event.params.questionId);

  //let esUtils = new ESUtils();
  //getCategories().then(function (categories: Category[]) {
  //console.log(categories);
  const data = change.after.data();

  if (data) {
    //add or update
    ESUtils.createOrUpdateIndex(ESUtils.QUESTIONS_INDEX, data.categoryIds["0"], data, context.params.questionId);

    const question: Question = data;
    const userContributionStat: UserContributionStat = new UserContributionStat(admin.firestore());
    userContributionStat.getUser(question.created_uid, UserStatConstants.initialContribution).then((userDictResults) => {
      console.log('updated user category stat');
    });
  }
  else {
    //delete
    ESUtils.removeIndex(ESUtils.QUESTIONS_INDEX, context.params.questionId);
  }
  //});
});

exports.onGameUpdate = functions.firestore.document('/games/{gameId}').onUpdate((change, context) => {

  const beforeEventData = change.after.data();
  const afterEventData = change.after.data();

  if (afterEventData !== beforeEventData) {
    console.log('data changed');
    const game: Game = afterEventData;
    if (game.gameOver) {
      const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats(admin.firestore());
      gameLeaderBoardStats.getGameUsers(game);
    }

  }

});

exports.onUserUpdate = functions.firestore.document('/users/{userId}').onUpdate((change, context) => {

  const beforeEventData = change.after.data();
  const afterEventData = change.after.data();

  if (afterEventData !== beforeEventData) {
    console.log('data changed');
    const userObj: User = afterEventData;
    const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats(admin.firestore());
    gameLeaderBoardStats.getLeaderBoardStat().then((lbsStats) => {
      lbsStats = gameLeaderBoardStats.calculateLeaderBoardStat(userObj, lbsStats);
      console.log('lbsStats', lbsStats);
      gameLeaderBoardStats.updateLeaderBoard({ ...lbsStats }).then((leaderBoardStat) => {
        // console.log('leaderBoardStat', leaderBoardStat);
      });
    });
  }

});


exports.onInvitationWrite = functions.firestore.document('/invitations/{invitationId}').onWrite((change, context) => {

  const beforeEventData = change.after.data();
  const afterEventData = change.after.data();

  if (afterEventData !== beforeEventData) {
    const invitation: Invitation = afterEventData;
    TinyURL.shorten(`${TriggerConstants.hostURL}${invitation.id}`, (shortURL) => {
      const htmlContent = `<a href="${shortURL}">Accept Invitation</a>`;
      const mail: MailClient = new MailClient(invitation.email, TriggerConstants.invitationMailSubject,
        TriggerConstants.invitationTxt, htmlContent);
      mail.sendMail();
    });
  }

});