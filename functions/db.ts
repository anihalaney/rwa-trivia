import { Game, Question, Category, User } from '../src/app/model';
import { ESUtils } from './ESUtils';
import { GameLeaderBoardStats } from './game-leaderboard-stats';

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
    const userIds = Object.keys(game.stats);
    const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats(admin.firestore());
    gameLeaderBoardStats.calculateUserStat(userIds, 0, game, game.gameOptions.categoryIds).then((status) => {
      console.log('status--->', status);
    });
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
