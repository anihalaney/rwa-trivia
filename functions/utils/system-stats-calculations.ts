const statService = require('../services/stats.service');
const statUserService = require('../services/user.service');
const statQuestionService = require('../services/question.service');
const statGameService = require('../services/game.service');

import { SystemStats } from '../../src/app/model';


export class SystemStatsCalculations {

    public generateSystemStats(): Promise<any> {
        return statService.getSystemStats('system')
            .then((systemStat) => {
                const systemStatObj: SystemStats = (systemStat.data()) ? systemStat.data() : new SystemStats();
                return statUserService.getUsers()
                    .then((users) => {
                        systemStatObj.total_users = users.size;
                        return statQuestionService.getAllQuestions()
                            .then((questions) => {
                                systemStatObj.total_questions = questions.size;
                                return statGameService.getLiveGames()
                                    .then((active_games) => {
                                        systemStatObj.active_games = active_games.size;
                                        return statGameService.getCompletedGames()
                                            .then((total_games) => {
                                                systemStatObj.game_played = total_games.size;
                                                return statService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                                                    return status;
                                                });
                                            });
                                    });
                            });
                    });
            });
    }

    public updateSystemStats(entity: string): Promise<any> {
        return statService.getSystemStats('system')
            .then((systemStat) => {
                const systemStatObj: SystemStats = (systemStat.data()) ? systemStat.data() : new SystemStats();
              //  console.log('systemStatObj', systemStatObj);
              //  console.log('entity', entity);
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
                   // console.log('game_played');
                    return statGameService.getCompletedGames()
                        .then((total_games) => {
                           // console.log('total_games', total_games);
                            systemStatObj.game_played = total_games.size;
                            return statService.setSystemStats('system', { ...systemStatObj }).then((status) => {
                                return status;
                            });
                        });
                }


            });
    }



}
