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


    createNewGame(friendId?: string): Promise<string> {

        if (Number(this.gameOptions.playerMode) === PlayerMode.Opponent) {
            if (Number(this.gameOptions.opponentType) === OpponentType.Random) {
                return this.joinGame().then((gameId) => { return gameId });
            } else if (Number(this.gameOptions.opponentType) === OpponentType.Friend) {
                return this.createFriendUserGame(friendId).then((gameId) => { return gameId });
            }
        } else {
            return this.createSingleAndRandomUserGame().then((gameId) => { return gameId });
        }

    }


    private joinGame(): Promise<string> {
        return this.db.collection('games').where('GameStatus', '==', GameStatus.AVAILABLE_FOR_OPPONENT)
            .where('gameOver', '==', false)
            .get().then(games => {
                const gameArr = [];

                games.forEach(game => {
                    gameArr.push(Game.getViewModel(game.data()))
                });
                const totalGames = gameArr.length;
                if (totalGames > 0) {
                    const promise = this.pickRandomGame(gameArr, totalGames);
                    return promise.then((gameId) => { return gameId });
                } else {
                    return this.createSingleAndRandomUserGame().then((gameId) => { return gameId });
                }
            });

    }

    private pickRandomGame(queriedItems: Array<Game>, totalGames: number): Promise<string> {

        const randomGameNo = Math.floor(Math.random() * totalGames);
        const game = queriedItems[randomGameNo];

        if (game.playerIds[0] !== this.userId && game.nextTurnPlayerId === '') {
            game.nextTurnPlayerId = this.userId;
            game.GameStatus = GameStatus.JOINED_GAME;
            game.addPlayer(this.userId);
            game.playerIds.map((playerId) => {
                game.calculateStat(playerId);
            })

            const dbGame = game.getDbModel();
            return this.UpdateGame(dbGame).then((gameId) => { return gameId });
        } else if (totalGames === 1) {
            return this.createSingleAndRandomUserGame().then((gameId) => { return gameId });
        } else {
            totalGames--;
            queriedItems.splice(randomGameNo, 1);
            return this.pickRandomGame(queriedItems, totalGames);
        }


    }


    private createSingleAndRandomUserGame(): Promise<string> {
        const timestamp = new Date(new Date().toUTCString()).getTime();
        const game = new Game(this.gameOptions, this.userId, undefined, undefined, false, this.userId, undefined, undefined,
            GameStatus.STARTED, timestamp, timestamp);
        return this.createGame(game);

    }

    private createFriendUserGame(friendId: string): Promise<string> {
        const timestamp = new Date(new Date().toUTCString()).getTime();
        const game = new Game(this.gameOptions, this.userId, undefined, undefined, false, this.userId, friendId, undefined,
            GameStatus.STARTED, timestamp, timestamp);
        return this.createGame(game);

    }


    private createGame(game: Game): Promise<string> {
        game.generateDefaultStat();
        const dbGame = game.getDbModel(); // object to be saved
        return this.db.collection('games').add(dbGame).then(ref => {
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
