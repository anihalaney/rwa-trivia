import {
    CollectionConstants, Game, Question, SystemStatConstants, SystemStats, User, GamePlayedWith
} from '../../projects/shared-library/src/lib/shared/model';
import admin from '../db/firebase.client';
import { Utils } from '../utils/utils';
import { GameService } from './game.service';
import { QuestionService } from './question.service';
import { UserService } from './user.service';
import { SystemStatsAtomic } from '../model';

export class StatsService {

    private static statsFireStoreClient = admin.firestore();

    /**
     * getSystemStats
     * return systemstat
     */
    static async getSystemStats(statName: string): Promise<any> {
        try {
            const systemStat = await StatsService.statsFireStoreClient
                .doc(`${CollectionConstants.STATS}/${statName}`)
                .get();
            return systemStat.data();
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    /**
     * setSystemStats
     * return ref
     */
    static async setSystemStats(statName: string, SystemStat: any): Promise<any> {
        try {
            return await StatsService.statsFireStoreClient
                .doc(`${CollectionConstants.STATS}/${statName}`)
                .set(SystemStat, { merge: true });
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    static async generateSystemStats(): Promise<any> {
        try {
            let systemStatObj: SystemStats = await StatsService.getSystemStats(CollectionConstants.STATS_SYSTEM);
            systemStatObj = (systemStatObj) ? systemStatObj : new SystemStats();

            const systemStatPromises = [];
            const users: User[] = await UserService.getUsers();
            const questions: Question[] = await QuestionService.getAllQuestions();
            const games: Game[] = await GameService.getCompletedGames();

            systemStatPromises.push(GameService.getLiveGames());
            const statResults = await Promise.all(systemStatPromises);

            systemStatObj.active_games = statResults[0].size;
            systemStatObj.total_users = users.length;
            systemStatObj.total_questions = questions.length;
            systemStatObj.game_played = games.length;
            return await StatsService.setSystemStats(CollectionConstants.STATS_SYSTEM, { ...systemStatObj });
        } catch (error) {
            return Utils.throwError(error);
        }
    }

    static async updateSystemStats(entity: string): Promise<any> {
        try {
            let systemStatObj: SystemStatsAtomic = await StatsService.getSystemStats(CollectionConstants.STATS_SYSTEM);
            systemStatObj = (systemStatObj) ? systemStatObj : new SystemStatsAtomic();

            switch (entity) {
                case SystemStatConstants.TOTAL_USERS:
                    systemStatObj.total_users = (systemStatObj.total_users) ? Utils.changeFieldValue(1) : 1;
                    break;
                case SystemStatConstants.TOTAL_QUESTIONS:
                    systemStatObj.total_questions = (systemStatObj.total_questions)
                        ? Utils.changeFieldValue(1) : 1;
                    break;
                case SystemStatConstants.ACTIVE_GAMES:
                    const active_games = await GameService.getLiveGames();
                    systemStatObj.active_games = active_games.size;
                    break;
                case SystemStatConstants.GAME_PLAYED:
                    const games: Game[] = await GameService.getCompletedGames();
                    systemStatObj.game_played = games.length;
                    break;
            }

            return await StatsService.setSystemStats(CollectionConstants.STATS_SYSTEM, { ...systemStatObj });

        } catch (error) {
            return Utils.throwError(error);
        }
    }


    static async updateUserPlayedGameStats(userId: string, otherUserId: string, userType: string): Promise<any> {
        try {
            let userGameStat: GamePlayedWith = await UserService.getOtherUserGameStatById(userId, otherUserId);
            let gamePlayedWith = new GamePlayedWith();
            if (userType === 'current_user') {
                if ( userGameStat ) {
                    gamePlayedWith = userGameStat;
                } else {
                    gamePlayedWith.created_uid = otherUserId;
                }
                gamePlayedWith.date = Utils.getUTCTimeStamp();
            } else if (userType === 'other_user' && !userGameStat) {
                gamePlayedWith.date = 0;
                gamePlayedWith.created_uid = otherUserId;
            } else {
                return;
            }
            console.log(userType, gamePlayedWith);
            userGameStat = { ...gamePlayedWith };
            console.log('why here should not be');
            return await UserService.setGameStat({ ...userGameStat }, userId, otherUserId);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


    static async updateQuestionStats(questionId: string, type: string, update?: boolean): Promise<any> {
        try {
            let question: Question = await QuestionService.getQuestionById(questionId);
            if (type === 'CREATED') {
                question.appeared = question.appeared ? Utils.changeFieldValue(1) : 1;
            } else if (type === 'UPDATED' && update) {
                question.correct = question.correct ? Utils.changeFieldValue(1) : 1;
            } else if (type === 'UPDATED' && !update) {
                question.wrong = question.wrong ? Utils.changeFieldValue(1) : 1;
            }
            return await QuestionService.updateQuestion('questions', { ...question } );
        } catch (error) {
            return Utils.throwError(error);
        }
    }

}
