import { SearchCriteria, Game, GameOperations, PlayerQnA, GameStatus, schedulerConstants } from '../../src/app/model';
import { Utils } from '../utils/utils';
import { GameMechanics } from '../utils/game-mechanics';
const gameControllerService = require('../services/game.service');
const utils: Utils = new Utils();

/**
 * createGame
 * return gameId
 */
exports.createGame = (req, res) => {
    const gameOptions = req.body.gameOptions;
    const userId = req.body.userId;

    if (!gameOptions) {
        // Game Option is not added
        res.status(403).send('Game Option is not added in request');
        return;
    }

    if (!userId) {
        // userId
        res.status(403).send('userId is not added in request');
        return;
    }

    const gameMechanics: GameMechanics = new GameMechanics(gameOptions, userId);
    gameMechanics.createNewGame().then((gameId) => {
        console.log('gameId', gameId);
        res.send({ gameId: gameId });
    });
};


/**
 * updateGame
 * return
 */
exports.updateGame = (req, res) => {
    const gameId = req.params.gameId;
    let dbGame = '';
    const operation = req.body.operation;

    if (!gameId) {
        // gameId
        res.status(400);
        return;
    }

    if (!operation) {
        // operation
        res.status(400);
        return;
    }
    //  console.log('gameId', gameId);
    // console.log('operation', operation);
    const gameMechanics: GameMechanics = new GameMechanics(undefined, undefined);

    gameMechanics.getGameById(gameId).then((game) => {
        // console.log('game', game);
        if (game.playerIds.indexOf(req.user.uid) === -1) {
            // operation
            res.status(403).send('Unauthorized');
            return;
        }

        switch (operation) {
            case GameOperations.CALCULATE_SCORE:
                const playerQnAs: PlayerQnA = req.body.playerQnA;
                game.playerQnAs.push(playerQnAs);
                game.decideNextTurn(playerQnAs, req.user.uid);
                game.turnAt = utils.getUTCTimeStamp();
                game.calculateStat(playerQnAs.playerId);

                break;
            case GameOperations.GAME_OVER:
                game.gameOver = true;
                game.decideWinner();
                game.GameStatus = GameStatus.COMPLETED;
                break;
            case GameOperations.REPORT_STATUS:
                const playerQnA: PlayerQnA = req.body.playerQnA;
                const index = game.playerQnAs.findIndex(
                    playerInfo => playerInfo.questionId === playerQnA.questionId
                );
                game.playerQnAs[index] = playerQnA;
                break;
        }
        dbGame = game.getDbModel();

        gameMechanics.UpdateGame(dbGame).then((id) => {
            res.send({});
        });
    })
};


/**
 * updateAllGame
 * return status
 */
exports.updateAllGame = (req, res) => {
    gameControllerService.getAvailableGames().then((snapshot) => {
        snapshot.forEach((doc) => {

            const game = Game.getViewModel(doc.data());

            game.playerIds.forEach((playerId) => {
                game.calculateStat(playerId);
            });

            const date = new Date(new Date().toUTCString());
            const millis = date.getTime() + (date.getTimezoneOffset() * 60000);
            game.turnAt = millis;

            const dbGame = game.getDbModel();
            dbGame.id = doc.id;

            gameControllerService.setGame(dbGame).then((ref) => {
                // console.log('dbGame===>', dbGame);
            });
        });
        res.send('loaded data');


    });
};


/**
 * checkGameOver
 * return status
 */
exports.checkGameOver = (req, res) => {
    gameControllerService.checkGameOver().then((snapshot) => {
        snapshot.forEach((doc) => {
            const game: Game = Game.getViewModel(doc.data());
            if (game.playerIds.length > 1 && game.nextTurnPlayerId !== '') {

                const millis = utils.getUTCTimeStamp();

                const noPlayTimeBound = millis - game.turnAt;
                const playedHours = Math.floor((noPlayTimeBound) / (1000 * 60 * 60));
                //  console.log('game--->', game.gameId);
                // console.log('noPlayTimeBound--->', noPlayTimeBound);
                if (playedHours >= schedulerConstants.gamePlayDuration) {
                    game.gameOver = true;
                    game.winnerPlayerId = game.playerIds.filter(playerId => playerId !== game.nextTurnPlayerId)[0];
                    const dbGame = game.getDbModel();
                    gameControllerService.updateGame(dbGame).then((ref) => {
                        console.log('updated game', dbGame.id);
                    });
                    //  console.log('updates=>', game.gameId);
                }
            }
        });
        res.send('scheduler check is completed');
    });
};

