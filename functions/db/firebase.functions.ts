
import * as functions from 'firebase-functions';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
    friendInvitationConstants, Game, Invitation, OpponentType,
    PlayerMode, Question, TriggerConstants, UserStatConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { AppSettings } from '../services/app-settings.service';
import { LeaderBoardService } from '../services/leaderboard.service';
import { ESUtils } from '../utils/ESUtils';
import { FriendGameStats } from '../utils/friend-game-stats';
import { GameLeaderBoardStats } from '../utils/game-leader-board-stats';
import { MailClient } from '../utils/mail-client';
import { SystemStatsCalculations } from '../utils/system-stats-calculations';
import { UserContributionStat } from '../utils/user-contribution-stat';
import admin from './firebase.client';
const mailConfig = JSON.parse(readFileSync(resolve(__dirname, '../../../config/mail.config.json'), 'utf8'));

export class FirebaseFunctions {
    static appSettings: AppSettings = new AppSettings();
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

                await UserContributionStat.getUser(question.created_uid, UserStatConstants.initialContribution);

                await SystemStatsCalculations.updateSystemStats('total_questions');

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

                await SystemStatsCalculations.updateSystemStats('active_games');
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

                    await GameLeaderBoardStats.getGameUsers(game);

                    if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent &&
                        Number(game.gameOptions.opponentType) === OpponentType.Friend) {
                        await FriendGameStats.calculateFriendsGameState(game);
                    }


                    await SystemStatsCalculations.updateSystemStats('active_games');
                }
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

                await SystemStatsCalculations.updateSystemStats('total_users');

                const appSetting = await this.appSettings.getAppSettings();
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

                let lbsStats = await LeaderBoardService.getLeaderBoardStats();

                lbsStats = (lbsStats.data()) ? lbsStats.data() : {};
                lbsStats = LeaderBoardService.calculateLeaderBoardStats(account, lbsStats);

                await LeaderBoardService.setLeaderBoardStats({ ...lbsStats });
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
