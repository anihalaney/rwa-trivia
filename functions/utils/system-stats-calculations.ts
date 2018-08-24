const statService = require('../services/stats.service');
const statUserService = require('../services/user.service');
const statQuestionService = require('../services/question.service');
const statGameService = require('../services/game.service');

import { SystemStats } from '../../projects/shared-library/src/lib/shared/model';


export class SystemStatsCalculations {

    public generateSystemStats(): Promise<any> {
        return statService.getSystemStats('system')
            .then((systemStat) => {
                const systemStatObj: SystemStats = (systemStat.data()) ? systemStat.data() : new SystemStats();
                const systemStatPromises = [];
                systemStatPromises.push(statUserService.getUsers());
                systemStatPromises.push(statQuestionService.getAllQuestions());
                systemStatPromises.push(statGameService.getLiveGames());
                systemStatPromises.push(statGameService.getCompletedGames());

                return Promise.all(systemStatPromises)
                    .then((statResults) => {
                        systemStatObj.total_users = statResults[0].size;
                        systemStatObj.total_questions = statResults[1].size;
                        systemStatObj.active_games = statResults[2].size;
                        systemStatObj.game_played = statResults[3].size;
                        return statService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                            return status;
                        });
                    });
            });
    }

    public updateSystemStats(entity: string): Promise<any> {
        return statService.getSystemStats('system')
            .then((systemStat) => {
                const systemStatObj: SystemStats = (systemStat.data()) ? systemStat.data() : new SystemStats();
                if (entity === 'total_users') {
                    systemStatObj.total_users = (systemStatObj.total_users) ? systemStatObj.total_users + 1 : 1;
                    return statService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                        return status;
                    });
                } else if (entity === 'total_questions') {
                    systemStatObj.total_questions = (systemStatObj.total_questions)
                        ? systemStatObj.total_questions + 1 : 1;
                    return statService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                        return status;
                    });
                } else if (entity === 'active_games') {
                    return statGameService.getLiveGames()
                        .then((active_games) => {
                            systemStatObj.active_games = active_games.size;
                            return statService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                                return status;
                            });
                        });
                } else if (entity === 'game_played') {
                    return statGameService.getCompletedGames()
                        .then((total_games) => {
                            systemStatObj.game_played = total_games.size;
                            return statService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                                return status;
                            });
                        });
                }


            });
    }



}
