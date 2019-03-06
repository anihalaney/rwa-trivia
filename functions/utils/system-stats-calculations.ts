import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';
import {
    SystemStats, User, Game, Question,
    CollectionConstants, SystemStatConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { GameService } from '../services/game.service';
import { StatsService } from '../services/stats.service';
import { Utils } from './utils';

export class SystemStatsCalculations {

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
            let systemStatObj: SystemStats = await StatsService.getSystemStats(CollectionConstants.STATS_SYSTEM);
            systemStatObj = (systemStatObj) ? systemStatObj : new SystemStats();
            if (entity === SystemStatConstants.TOTAL_USERS) {
                systemStatObj.total_users = (systemStatObj.total_users) ? systemStatObj.total_users + 1 : 1;
                return await StatsService.setSystemStats(CollectionConstants.STATS_SYSTEM, { ...systemStatObj });
            } else if (entity === SystemStatConstants.TOTAL_QUESTIONS) {
                systemStatObj.total_questions = (systemStatObj.total_questions)
                    ? systemStatObj.total_questions + 1 : 1;
                return await StatsService.setSystemStats(CollectionConstants.STATS_SYSTEM, { ...systemStatObj });
            } else if (entity === SystemStatConstants.ACTIVE_GAMES) {
                const active_games = await GameService.getLiveGames();
                systemStatObj.active_games = active_games.size;
                return await StatsService.setSystemStats(CollectionConstants.STATS_SYSTEM, { ...systemStatObj });
            } else if (entity === SystemStatConstants.GAME_PLAYED) {
                const games: Game[] = await GameService.getCompletedGames();
                systemStatObj.game_played = games.length;
                return await StatsService.setSystemStats(CollectionConstants.STATS_SYSTEM, { ...systemStatObj });
            }
        } catch (error) {
            return Utils.throwError(error);
        }

    }



}
