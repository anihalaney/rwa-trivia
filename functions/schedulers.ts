import { Game, Question, Category, SearchCriteria, GameStatus } from '../src/app/model';

const cron = require('node-cron');

export class GameScheduler {

    private firebaseApp: any;
    private task: any;

    constructor(private app: any) {
        this.firebaseApp = app;
        this.task = this.checkGames();
    }

    checkGames(): any {
        return cron.schedule('* */1 * * *', function () {
            const db = this.firebaseApp;
            db.collection('/games').where('gameOver', '==', false)
                .where('GameStatus', '==', GameStatus.WAITING_FOR_NEXT_Q)
                .get()
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        const game: Game = Game.getViewModel(doc.data());
                        if (game.playerIds.length > 1 && game.nextTurnPlayerId !== '') {
                            const criteriaTimeBound = 32 * 60 * 60 * 1000;
                            const noPlayTimeBound = new Date().getTime() - game.turnAt;
                            console.log('game--->', game.gameId);
                            console.log('noPlayTimeBound--->', noPlayTimeBound);
                            if (noPlayTimeBound >= criteriaTimeBound) {
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

    startCron(): void {
        this.task.start();

    }

    stopCron(): void {
        this.task.stop();
    }
}
