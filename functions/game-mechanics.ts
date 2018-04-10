import { Game, GameStatus, GameOptions, PlayerMode, OpponentType } from '../src/app/model';
import { Observable } from 'rxjs/Observable';

export class GameMechanics {

    private gameOptions: GameOptions;
    private userId: string;
    private db: any

    constructor(private game_option?, private user_id?, private firebaseDB?: any) {
        this.gameOptions = game_option;
        this.userId = user_id;
        this.db = firebaseDB;
    }


    createNewGame(): Promise<string> {

        if (Number(this.gameOptions.playerMode) === PlayerMode.Opponent
            && Number(this.gameOptions.opponentType) === OpponentType.Random) {
            // console.log('joinGame');
            return this.joinGame().then((gameId) => { return gameId });
        } else {
            // console.log('createGame');
            return this.createGame().then((gameId) => { return gameId });
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
                    // console.log('pickRandomGame');
                    return this.pickRandomGame(gameArr, totalGames).then((gameId) => { return gameId });
                } else {
                    // console.log('joinGame-createGame');
                    return this.createGame().then((gameId) => { return gameId });
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
            // console.log('game.gameId', game.gameId);
            return this.UpdateGame(dbGame).then((gameId) => { return gameId });
        } else if (totalGames === 1) {
            // console.log('pickRandomGame-createGame');
            return this.createGame().then((gameId) => { return gameId });
        } else {
            totalGames--;
            queriedItems.splice(randomGameNo, 1);
            this.pickRandomGame(queriedItems, totalGames);
        }
    }


    private createGame(): Promise<string> {
        const game = new Game(this.gameOptions, this.userId, undefined, undefined, false, this.userId, undefined, undefined,
            GameStatus.STARTED, new Date().getTime(), new Date().getTime());
        const dbGame = game.getDbModel(); // object to be saved
        // console.log('this.db', JSON.stringify(this.db));
        return this.db.collection('games').add(dbGame).then(ref => {
            // console.log('Added document with ID: ', ref.id);
            dbGame.id = ref.id;
            return this.UpdateGame(dbGame).then((gameId) => { return gameId });
        });


    }

    public getGameById(gameId: string): Promise<Game> {
        return this.db.doc(`games/${gameId}`)
            .get().then(game => Game.getViewModel(game.data()));
    }

    private UpdateGame(dbGame: any): Promise<string> {
        // Use the set method of the doc instead of the add method on the collection,
        // so the id field of the data matches the id of the document
        return this.db.doc('/games/' + dbGame.id).set(dbGame).then(ref => {

            return dbGame.id;
        });
    }

    public UpdateGameCollection(dbGame: any): Promise<string> {
        // Use the set method of the doc instead of the add method on the collection,
        // so the id field of the data matches the id of the document
        return this.db.doc('/games/' + dbGame.id).update(dbGame).then(ref => {

            return dbGame.id;
        });
    }


}
