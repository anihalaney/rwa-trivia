import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';
import { SystemStats } from '../../projects/shared-library/src/lib/shared/model';
import { GameService } from '../services/game.service';
import { StatsService } from '../services/stats.service';


export class SystemStatsCalculations {

    static async generateSystemStats(): Promise<any> {
        try {
            const systemStat = await StatsService.getSystemStats('system');
            const systemStatObj: SystemStats = (systemStat.data()) ? systemStat.data() : new SystemStats();
            const systemStatPromises = [];
            systemStatPromises.push(UserService.getUsers());
            systemStatPromises.push(QuestionService.getAllQuestions());
            systemStatPromises.push(GameService.getLiveGames());
            systemStatPromises.push(GameService.getCompletedGames());

            const statResults = await Promise.all(systemStatPromises);
            systemStatObj.total_users = statResults[0].size;
            systemStatObj.total_questions = statResults[1].size;
            systemStatObj.active_games = statResults[2].size;
            systemStatObj.game_played = statResults[3].size;
            return await StatsService.setSystemStats('system', { ...systemStatObj });
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }
    }

    static async updateSystemStats(entity: string): Promise<any> {
        try {
            const systemStat = await StatsService.getSystemStats('system');
            const systemStatObj: SystemStats = (systemStat.data()) ? systemStat.data() : new SystemStats();
            if (entity === 'total_users') {
                systemStatObj.total_users = (systemStatObj.total_users) ? systemStatObj.total_users + 1 : 1;
                return await StatsService.setSystemStats('system', { ...systemStatObj });
            } else if (entity === 'total_questions') {
                systemStatObj.total_questions = (systemStatObj.total_questions)
                    ? systemStatObj.total_questions + 1 : 1;
                return await StatsService.setSystemStats('system', { ...systemStatObj });
            } else if (entity === 'active_games') {
                const active_games = await GameService.getLiveGames();
                systemStatObj.active_games = active_games.size;
                return await StatsService.setSystemStats('system', { ...systemStatObj });
            } else if (entity === 'game_played') {
                const total_games = await GameService.getCompletedGames();
                systemStatObj.game_played = total_games.size;
                return await StatsService.setSystemStats('system', { ...systemStatObj });
            }
        } catch (error) {
            console.error('Error : ', error);
            throw error;
        }

    }



}
