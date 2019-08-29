
import * as functions from 'firebase-functions';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
    friendInvitationConstants, Game, Invitation, LeaderBoardUsers,
    OpponentType, PlayerMode, pushNotificationRouteConstants, Question,
    QuestionStatus, SystemStatConstants, TriggerConstants, UserStatConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { AppSettings } from '../services/app-settings.service';
import { LeaderBoardService } from '../services/leaderboard.service';
import { StatsService } from '../services/stats.service';
import { AchievementMechanics } from '../utils/achievement-mechanics';
import { ESUtils } from '../utils/ESUtils';
import { GamePlayedWithStats } from '../utils/game-played-with-stats';
import { GameLeaderBoardStats } from '../utils/game-leader-board-stats';
import { MailClient } from '../utils/mail-client';
import { PushNotification } from '../utils/push-notifications';
import { UserContributionStat } from '../utils/user-contribution-stat';
import admin from './firebase.client';
import { UserService } from '../services/user.service';
import { QuestionService } from '../services/question.service';
import { Utils } from '../utils/utils';
const mailConfig = JSON.parse(readFileSync(resolve(__dirname, '../../../config/mail.config.json'), 'utf8'));

export class FirebaseFunctions {

    // Take the text parameter passed to this HTTP endpoint and insert it into the
    // Realtime Database under the path /messages/:pushId/original
    static async  addMessage(firebaseFunctions: any): Promise<any> {
        firebaseFunctions.https.onRequest(async (req, res) => {
            // Grab the text parameter.

            const original = req.query.text;
            try {
                // Push it into the Realtime Database then send a response
                const snapshot = await admin.database().ref('/messages').push({ original: original });
                // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
                res.redirect(303, snapshot.ref);
            } catch (error) {
                console.error('Error :', error);
                throw error;
            }
        });
    }

    static async doQuestionWriteOperation(change: any, context: any): Promise<boolean> {
        try {
            const data = change.after.data();

            if (data) {
                const question: Question = data;

                data.createdOn = (data.createdOn && data.createdOn['_seconds']) ? new Date(data.createdOn['_seconds'] * 1000) : new Date();

                // add or update
                await ESUtils.createOrUpdateIndex(data.categoryIds['0'], question, context.params.questionId);

                await UserContributionStat.getUser(question.created_uid, UserStatConstants.initialContribution, false);

                await StatsService.updateSystemStats('total_questions');

            } else {
                // delete
                await ESUtils.removeIndex(context.params.questionId);
            }
            return true;
        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }


    static async doReactionWriteOperation(change: any, context: any): Promise<boolean> {
        try {
            if (context.params.reactions === 'reactions') {
                const afterData = change.after.exists ? change.after.data() : null;
                const beforeData = change.before.exists ? change.before.data() : null;
                const question: Question = await QuestionService.getQuestionById(context.params.questionId);
                // for update
                if (beforeData && afterData) {
                    if (beforeData.status != afterData.status) {
                        question.reactionsCount[afterData.status] = question.reactionsCount
                        && question.reactionsCount[afterData.status] ? Utils.changeFieldValue(1) : 1; // increase current status
                        question.reactionsCount[beforeData.status] = question.reactionsCount &&
                        question.reactionsCount[beforeData.status] ? Utils.changeFieldValue(-1) : 0; // decrease before status
                    } else {
                        return true;
                    }
                } else if (!beforeData && afterData) {
                // for create
                        question.reactionsCount[afterData.status] = question.reactionsCount
                        && question.reactionsCount[afterData.status] ? Utils.changeFieldValue(1) : 1; // increase current status
                } else if (beforeData && !afterData) {
                // delete
                        question.reactionsCount[beforeData.status] = question.reactionsCount &&
                        question.reactionsCount[beforeData.status] ? Utils.changeFieldValue(-1) : 0; // decrease current status
                } else {
                    return true;
                }
                const newquestion = {...question};
               await QuestionService.updateQuestion('questions', newquestion);
              return true;
            } else {
                return true;
            }
        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }
    static async doInvitationWriteOperation(change: any, context: any): Promise<boolean> {
        try {
            const beforeEventData = change.before.data();
            const afterEventData = change.after.data();
            const invitation: Invitation = afterEventData;

            if (afterEventData !== beforeEventData && mailConfig.enableMail && invitation.status === friendInvitationConstants.PENDING) {

                const url = `${mailConfig.hosturl}${invitation.id}`;

                const htmlContent = `You have a new invitation request.
                 Click <a href="${url}">Accept Invitation</a> to accept the invitation.`;

                const mail: MailClient = new MailClient(invitation.email, TriggerConstants.invitationMailSubject,
                    TriggerConstants.invitationTxt, htmlContent);

                await mail.sendMail();
            }

            return true;
        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }

    static async doGameCreateOperation(snap: any, context: any): Promise<boolean> {
        try {
            const data = snap.data();

            if (data) {

                await StatsService.updateSystemStats('active_games');
            }

            return true;
        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }

    static async doGameUpdateOperation(change: any, context: any): Promise<boolean> {
        try {
            const beforeEventData = change.before.data();
            const afterEventData = change.after.data();

            if (afterEventData !== beforeEventData) {

                const game: Game = Game.getViewModel(afterEventData);
                if (game.gameOver) {

                    await StatsService.updateSystemStats(SystemStatConstants.ACTIVE_GAMES);
                    await StatsService.updateSystemStats(SystemStatConstants.GAME_PLAYED);

                    await GameLeaderBoardStats.getGameUsers(game);

                    if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent &&
                        Number(game.gameOptions.opponentType) === OpponentType.Friend) {
                        await GamePlayedWithStats.calculateUserGamePlayedState(game);
                    }
                }

                await StatsService.calculateQuestionStat(beforeEventData, afterEventData);

            }

            return true;
        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }

    static async doUserCreateOperation(snap: any, context: any): Promise<boolean> {
        try {
            const data = snap.data();

            if (data) {

                await StatsService.updateSystemStats('total_users');

                await UserService.setUserDetails(data);

                const appSetting = await AppSettings.Instance.getAppSettings();
                if (appSetting.lives.enable) {
                    const accountObj: any = {};
                    accountObj.id = data.userId;
                    accountObj.lives = appSetting.lives.max_lives;
                    await AccountService.setAccount(accountObj);
                }
            }
            return true;
        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }

    static async doAccountUpdateOperation(change: any, context: any): Promise<boolean> {
        try {
            const beforeEventData = change.before.data();
            const afterEventData = change.after.data();

            if (afterEventData !== beforeEventData) {
                const account: Account = afterEventData;

                const leaderBoardDict: { [key: string]: LeaderBoardUsers } = await LeaderBoardService.getLeaderBoardStats();

                await GameLeaderBoardStats.setLeaderBoardStat(await LeaderBoardService.calculateLeaderBoardStats(account, leaderBoardDict));

                await AchievementMechanics.updateAchievement(account);
            }
            return true;

        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }

    static async doUnpublishedQuestionsUpdateOperation(change: any, context: any): Promise<boolean> {
        try {
            const beforeEventData = change.before.data();
            const afterEventData = change.after.data();
            if (beforeEventData.status !== afterEventData.status) {
                const oldStatus = QuestionStatus[beforeEventData.status].toLowerCase().replace('_', ' ');
                const newStatus = QuestionStatus[afterEventData.status].toLowerCase().replace('_', ' ');
                const message = `The status changed from ${oldStatus} to ${newStatus} for ${afterEventData.questionText}.`;
                console.log('message', message);
                PushNotification.sendGamePlayPushNotifications(message, afterEventData.created_uid,
                    pushNotificationRouteConstants.QUESTION_NOTIFICATIONS);

            }
            return true;

        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }

    static async doQuestionCreateOperation(snap: any, context: any): Promise<boolean> {
        try {
            const data = snap.data();
            if (data) {
                const question: Question = data;

                const message = `Your Question ${question.questionText} is approved `;
                console.log('Notification sent on question approved');
                PushNotification.sendGamePlayPushNotifications(message, question.created_uid,
                    pushNotificationRouteConstants.QUESTION_NOTIFICATIONS);

                // Add four bytes when question is approve
                await AccountService.earnBytesOnQuestionContribute(question.created_uid);
            }
            return true;
        } catch (error) {
            console.error('Error :', error);
            throw error;
        }
    }
}

exports.onQuestionWrite = functions.firestore.document('/questions/{questionId}')
    .onWrite(async (change, context) => await FirebaseFunctions.doQuestionWriteOperation(change, context));

exports.onReactionWrite = functions.firestore.document('/questions/{questionId}/{reactions}/{userId}')
    .onWrite(async (snap, context) => await FirebaseFunctions.doReactionWriteOperation(snap, context));

exports.onInvitationWrite = functions.firestore.document('/invitations/{invitationId}')
    .onWrite(async (change, context) => await FirebaseFunctions.doInvitationWriteOperation(change, context));

// update stats based on game creation
exports.onGameCreate = functions.firestore.document('/games/{gameId}')
    .onCreate(async (snap, context) => await FirebaseFunctions.doGameCreateOperation(snap, context));

exports.onGameUpdate = functions.firestore.document('/games/{gameId}')
    .onUpdate(async (change, context) => await FirebaseFunctions.doGameUpdateOperation(change, context));

// update stats based on user creation
exports.onUserCreate = functions.firestore.document('/users/{userId}')
    .onCreate(async (snap, context) => await FirebaseFunctions.doUserCreateOperation(snap, context));

exports.onAccountUpdate = functions.firestore.document('/accounts/{accountId}')
    .onUpdate(async (change, context) => await FirebaseFunctions.doAccountUpdateOperation(change, context));

exports.onUnpublishedQuestionsUpdate = functions.firestore.document('/unpublished_questions/{questionId}')
    .onUpdate(async (change, context) => await FirebaseFunctions.doUnpublishedQuestionsUpdateOperation(change, context));

exports.onQuestionCreate = functions.firestore.document('/questions/{questionId}')
    .onCreate(async (snap, context) => await FirebaseFunctions.doQuestionCreateOperation(snap, context));
