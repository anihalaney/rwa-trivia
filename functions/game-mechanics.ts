import { Game, GameStatus, GameOptions, PlayerMode, OpponentType } from '../src/app/model';
import { Observable } from 'rxjs/Observable';

export class GameMechanics {

    private gameOptions: GameOptions;
    private userId: string;
    private db: any

    constructor(private game_option, private user_id, private fire_store_db: any) {
        this.gameOptions = game_option;
        this.userId = user_id;
        this.db = fire_store_db;
    }


    createNewGame(): Promise<string> {
        if (Number(this.gameOptions.playerMode) === PlayerMode.Opponent
            && Number(this.gameOptions.opponentType) === OpponentType.Random) {
            return this.joinGame();
        } else {
            return this.createGame();
        }
    }


    private joinGame(): Promise<string> {
        return this.db.collection('games').where('GameStatus', '==', GameStatus.WAITING_FOR_NEXT_Q)
            .where('nextTurnPlayerId', '==', '').where('gameOver', '==', false)
            .get().then(games => {
                const gameArr = [];
                games.forEach(game => {
                    gameArr.push(Game.getViewModel(game.data()))
                });
                const totalGames = gameArr.length;
                if (totalGames > 0) {
                    return this.pickRandomGame(gameArr, totalGames);
                } else {
                    return this.createGame();
                }
            });

    }

    private pickRandomGame(queriedItems: Array<Game>, totalGames: number): Promise<string> {
        const randomGameNo = Math.floor(Math.random() * totalGames);
        const game = queriedItems[randomGameNo];
        if (game.playerIds[0] !== this.userId) {
            game.nextTurnPlayerId = this.userId;
            game.addPlayer(this.userId);
            const dbGame = game.getDbModel();
            return this.db.doc('/games/' + game.gameId).set(dbGame).then(ref => {
                console.log('game.gameId', game.gameId);
                return game.gameId;
            });
        } else if (totalGames === 1) {
            return this.createGame();
        } else {
            totalGames--;
            queriedItems.splice(randomGameNo, 1);
            this.pickRandomGame(queriedItems, totalGames);
        }
    }

    private UpdateGame(game: Game, dbGame: any): Promise<string> {
        return this.db.doc('/games/' + game.gameId).set(dbGame).then(ref => {
            console.log('game.gameId', game.gameId);
            return game.gameId;
        });
    }

    private createGame(): Promise<string> {
        const game = new Game(this.gameOptions, this.userId, undefined, undefined, false, this.userId, undefined, undefined,
            GameStatus.STARTED, new Date().getTime(), new Date().getTime());
        const dbGame = game.getDbModel(); // object to be saved

        const id = this.db.createId();
        dbGame.id = id;

        // Use the set method of the doc instead of the add method on the collection,
        // so the id field of the data matches the id of the document
        return this.db.doc('/games/' + id).set(dbGame).then(ref => {
            console.log('id', id);
            return id;
        });

    }


}
