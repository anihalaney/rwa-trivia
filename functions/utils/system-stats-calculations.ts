import { QuestionService } from '../services/question.service';
import { UserService } from '../services/user.service';
import { SystemStats } from '../../projects/shared-library/src/lib/shared/model';
import { GameService } from '../services/game.service';
import { StatsService } from '../services/stats.service';


export class SystemStatsCalculations {

    public generateSystemStats(): Promise<any> {
        return StatsService.getSystemStats('system')
            .then((systemStat) => {
                const systemStatObj: SystemStats = (systemStat.data()) ? systemStat.data() : new SystemStats();
                const systemStatPromises = [];
                systemStatPromises.push(UserService.getUsers());
                systemStatPromises.push(QuestionService.getAllQuestions());
                systemStatPromises.push(GameService.getLiveGames());
                systemStatPromises.push(GameService.getCompletedGames());

                return Promise.all(systemStatPromises)
                    .then((statResults) => {
                        systemStatObj.total_users = statResults[0].size;
                        systemStatObj.total_questions = statResults[1].size;
                        systemStatObj.active_games = statResults[2].size;
                        systemStatObj.game_played = statResults[3].size;
                        return StatsService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                            return status;
                        });
                    });
            });
    }

    public updateSystemStats(entity: string): Promise<any> {
        return StatsService.getSystemStats('system')
            .then((systemStat) => {
                const systemStatObj: SystemStats = (systemStat.data()) ? systemStat.data() : new SystemStats();
                if (entity === 'total_users') {
                    systemStatObj.total_users = (systemStatObj.total_users) ? systemStatObj.total_users + 1 : 1;
                    return StatsService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                        return status;
                    });
                } else if (entity === 'total_questions') {
                    systemStatObj.total_questions = (systemStatObj.total_questions)
                        ? systemStatObj.total_questions + 1 : 1;
                    return StatsService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                        return status;
                    });
                } else if (entity === 'active_games') {
                    return GameService.getLiveGames()
                        .then((active_games) => {
                            systemStatObj.active_games = active_games.size;
                            return StatsService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                                return status;
                            });
                        });
                } else if (entity === 'game_played') {
                    return GameService.getCompletedGames()
                        .then((total_games) => {
                            systemStatObj.game_played = total_games.size;
                            return StatsService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                                return status;
                            });
                        });
                }


            });
    }



}
