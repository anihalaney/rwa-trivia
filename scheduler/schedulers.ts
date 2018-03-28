import { Game, Question, Category, SearchCriteria, GameStatus } from '../src/app/model';
import { schedulerConstants } from './constants';

const cron = require('node-cron');

export class GameScheduler {

    constructor() {
    }

    checkGames(db: any): any {
        cron.schedule(schedulerConstants.cronExpression, function () {
            db.collection('/games').where('gameOver', '==', false)
                .where('GameStatus', '==', GameStatus.WAITING_FOR_NEXT_Q)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        const game: Game = Game.getViewModel(doc.data());
                        if (game.playerIds.length > 1 && game.nextTurnPlayerId !== '') {
                            const noPlayTimeBound = new Date().getTime() - game.turnAt;
                            console.log('game--->', game.gameId);
                            console.log('noPlayTimeBound--->', noPlayTimeBound);
                            if (noPlayTimeBound >= schedulerConstants.gamePlayDuration) {
                                game.gameOver = true;
                                game.winnerPlayerId = game.playerIds.filter(playerId => playerId !== game.nextTurnPlayerId)[0];
                                const dbGame = game.getDbModel();
                                db.doc('/games/' + game.gameId).update(dbGame);
                                console.log('updates=>', game.gameId);
                            }
                        }
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);
                });
        });
    }

}
