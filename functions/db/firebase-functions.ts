const functionFireBaseClient = require('../db/firebase-client');
const functionFireStoreClient = functionFireBaseClient.firestore();
const functions = require('firebase-functions');
const TinyURL = require('tinyurl');
const fs = require('fs');
const path = require('path');
const mailConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../config/mail.config.json'), 'utf8'));


import { Game, Question, Category, User, UserStatConstants, Invitation, TriggerConstants } from '../../src/app/model';
import { ESUtils } from '../utils/ESUtils';
import { GameLeaderBoardStats } from '../utils/game-leader-board-stats';
import { UserContributionStat } from '../utils/user-contribution-stat';
import { MailClient } from '../utils/mail-client';

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = (firebaseFunctions: any) => {

    firebaseFunctions.https.onRequest((req, res) => {
        // Grab the text parameter.

        const original = req.query.text;
        // Push it into the Realtime Database then send a response
        functionFireBaseClient.database().ref('/messages').push({ original: original }).then(snapshot => {
            // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
            res.redirect(303, snapshot.ref);
        });
    });

};

exports.onQuestionWrite = functions.firestore.document('/questions/{questionId}').onWrite((change, context) => {

    const data = change.after.data();

    if (data) {
        // add or update
        ESUtils.createOrUpdateIndex(ESUtils.QUESTIONS_INDEX, data.categoryIds['0'], data, context.params.questionId);

        const question: Question = data;
        const userContributionStat: UserContributionStat = new UserContributionStat();
        userContributionStat.getUser(question.created_uid, UserStatConstants.initialContribution).then((userDictResults) => {
            console.log('updated user category stat');
        });
    } else {
        // delete
        ESUtils.removeIndex(ESUtils.QUESTIONS_INDEX, context.params.questionId);
    }

});

exports.onGameUpdate = functions.firestore.document('/games/{gameId}').onUpdate((change, context) => {

    const beforeEventData = change.after.data();
    const afterEventData = change.after.data();

    if (afterEventData !== beforeEventData) {
        console.log('data changed');
        const game: Game = afterEventData;
        if (game.gameOver) {
            const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats();
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
        const gameLeaderBoardStats: GameLeaderBoardStats = new GameLeaderBoardStats();
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