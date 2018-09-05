import { Game, GameStatus, GameOptions, PlayerMode, OpponentType } from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from './utils';
const utils: Utils = new Utils();
const gameService = require('../services/game.service');

export class GameMechanics {

    private gameOptions: GameOptions;
    private userId: string;


    constructor(private game_option?, private user_id?) {
        if (game_option) {
            this.gameOptions = game_option;
        }
        if (user_id) {
            this.userId = user_id;
        }
    }


    createNewGame(): Promise<string> {

        if (Number(this.gameOptions.playerMode) === PlayerMode.Opponent) {
            if (this.gameOptions.rematch) {
                return this.createFriendUserGame(this.gameOptions.friendId, GameStatus.RESTARTED).then((gameId) => { return gameId });
            } else {
                if (Number(this.gameOptions.opponentType) === OpponentType.Random) {
                    return this.joinGame().then((gameId) => { return gameId });
                } else if (Number(this.gameOptions.opponentType) === OpponentType.Friend) {
                    return this.createFriendUserGame(this.gameOptions.friendId, GameStatus.STARTED).then((gameId) => { return gameId });
                }
            }
        } else {
            return (this.gameOptions.rematch) ?
                this.createSingleAndRandomUserGame(GameStatus.RESTARTED).then((gameId) => { return gameId }) :
                this.createSingleAndRandomUserGame(GameStatus.STARTED).then((gameId) => { return gameId });
        }

    }


    private joinGame(): Promise<string> {
        console.log('joinGame');
        return gameService.getAvailableGames().then(games => {
            const gameArr = [];

            games.forEach(game => {
                gameArr.push(Game.getViewModel(game.data()))
            });
            const totalGames = gameArr.length;
            //  console.log('games', gameArr);
            if (totalGames > 0) {
                const promise = this.pickRandomGame(gameArr, totalGames);
                return promise.then((gameId) => { return gameId });
            } else {
                return this.createSingleAndRandomUserGame(GameStatus.STARTED).then((gameId) => { return gameId });
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
            return this.setGame(dbGame).then((gameId) => { return gameId });
        } else if (totalGames === 1) {
            return this.createSingleAndRandomUserGame(GameStatus.STARTED).then((gameId) => { return gameId });
        } else {
            totalGames--;
            queriedItems.splice(randomGameNo, 1);
            return this.pickRandomGame(queriedItems, totalGames);
        }


    }


    private createSingleAndRandomUserGame(gameStatus): Promise<string> {
        const timestamp = utils.getUTCTimeStamp();
        // console.log('timestamp', timestamp);
        const game = new Game(this.gameOptions, this.userId, undefined, undefined, false, this.userId, undefined, undefined,
            gameStatus, timestamp, timestamp);
        return this.createGame(game);

    }

    private createFriendUserGame(friendId: string, gameStatus): Promise<string> {
        const timestamp = utils.getUTCTimeStamp();
        const game = new Game(this.gameOptions, this.userId, undefined, undefined, false, this.userId, friendId, undefined,
            gameStatus, timestamp, timestamp);
        return this.createGame(game);

    }


    private createGame(game: Game): Promise<string> {
        game.generateDefaultStat();
        const dbGame = game.getDbModel(); // object to be saved
        return gameService.createGame(dbGame).then(ref => {
            dbGame.id = ref.id;
            return this.setGame(dbGame).then((gameId) => { return gameId });
        });

    }

    public getGameById(gameId: string): Promise<Game> {
        return gameService.getGameById(gameId).then(game => { return Game.getViewModel(game.data()) });
    }

    public setGame(dbGame: any): Promise<string> {
        // Use the set method of the doc instead of the add method on the collection,
        // so the id field of the data matches the id of the document
        return gameService.setGame(dbGame).then(ref => {
            return dbGame.id;
        });
    }

    public UpdateGame(dbGame: any): Promise<string> {
        // Use the set method of the doc instead of the add method on the collection,
        // so the id field of the data matches the id of the document
        return gameService.updateGame(dbGame).then(ref => {

            return dbGame.id;
        });
    }


    public changeTheTurn(game: Game): Promise<boolean> {


        console.log('playerQuestions---->', game.playerQnAs);

        if (game.playerQnAs.length > 0) {
            const index = game.playerQnAs.length - 1;
            const lastAddedQuestion = game.playerQnAs[index];

            if (!lastAddedQuestion.playerAnswerInSeconds && lastAddedQuestion.playerAnswerInSeconds !== 0) {
                lastAddedQuestion.playerAnswerId = null;
                lastAddedQuestion.answerCorrect = false;
                lastAddedQuestion.playerAnswerInSeconds = 16;
                game.playerQnAs[index] = lastAddedQuestion;
                if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent) {
                    game.nextTurnPlayerId = game.playerIds.filter((playerId) => playerId !== game.nextTurnPlayerId)[0];
                }
                game.turnAt = utils.getUTCTimeStamp();
                game.calculateStat(lastAddedQuestion.playerId);
                const dbGame = game.getDbModel();
                console.log('change the turn ---->', dbGame);
                return this.UpdateGame(dbGame).then((id) => {
                    return false;
                });
            } else {
                return Promise.resolve(true);
            }
        } else {
            return Promise.resolve(true);
        }

    }

    public updateRound(game: Game, userId: string): Game {
        if (game.playerQnAs.length > 0) {
            game.round = (game.round) ? game.round : game.stats[userId]['round'];
            const otherPlayerUserId = game.playerIds.filter(playerId => playerId !== userId)[0];
            const currentUserQuestions = game.playerQnAs.filter((pastPlayerQnA) =>
                pastPlayerQnA.playerId === userId);
            const otherUserQuestions = game.playerQnAs.filter((pastPlayerQnA) => pastPlayerQnA.playerId === otherPlayerUserId
            );
            if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent &&
                currentUserQuestions.length > 0 && otherUserQuestions.length > 0) {
                const lastcurrentUserQuestion = currentUserQuestions[currentUserQuestions.length - 1];
                const lastotherUserQuestions = otherUserQuestions[otherUserQuestions.length - 1];
                lastcurrentUserQuestion.round = (lastcurrentUserQuestion.round) ? lastcurrentUserQuestion.round : game.round;
                lastotherUserQuestions.round = (lastotherUserQuestions.round) ? lastotherUserQuestions.round : game.round;
                if (lastcurrentUserQuestion.round === lastotherUserQuestions.round
                    && !lastcurrentUserQuestion.answerCorrect
                    && !lastotherUserQuestions.answerCorrect) {
                    game.round = game.round + 1;
                }
            }
        }
        return game;
    }
}
