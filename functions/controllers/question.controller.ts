import { ESUtils } from '../utils/ESUtils';
import { SearchCriteria, Game, PlayerQnA, Question, PlayerMode } from '../../src/app/model';
import { GameMechanics } from '../utils/game-mechanics';
import { Utils } from '../utils/utils';
const utils: Utils = new Utils();
const questionControllerGameService = require('../services/game.service');
const questionControllerQuestionService = require('../services/question.service');

/**
 * getQuestionOfDay
 * return question of the day
 */
exports.getQuestionOfDay = (req, res) => {
    const isNextQuestion = (req.params.nextQ && req.params.nextQ === 'next') ? true : false
    ESUtils.getRandomQuestionOfTheDay(isNextQuestion).then((question) => {
        res.send(question);
    });
};


/**
 * getQuestions
 * return questions
 */
exports.getQuestions = (req, res) => {
    // Admins can get all Qs, while authorized users can only get Qs created by them
    // TODO: For now restricting it to admins only till we add security
    const start = req.params.start;
    const size = req.params.size;
    const criteria: SearchCriteria = req.body;
    console.log(criteria);

    ESUtils.getQuestions(start, size, criteria).then((results) => {
        res.send(results);
    });
};


/**
 * getNextQuestion
 * return question
 */
exports.getNextQuestion = (req, res) => {
    // console.log(req.user.uid);
    // console.log(req.params.gameId);

    const userId = req.user.uid;
    const gameId = req.params.gameId;
    let myTurnStatus = true;

    questionControllerGameService.getGameById(gameId).then((g) => {
        if (!g.exists) {
            // game not found
            res.status(404).send('Game not found');
            return;
        }
        const game: Game = Game.getViewModel(g.data());
        // console.log(game);


        if (game.playerIds.indexOf(userId) < 0) {
            // user not part of this game
            res.status(403).send('User not part of this game');
            return;
        }

        if (game.gameOver) {
            // gameOver
            res.status(403).send('Game over. No more Questions');
            return;
        }

        if (game.gameOptions.gameMode !== 0) {
            // Multiplayer mode - check whose turn it is. Not yet implemented
            res.status(501).send('Wait for your turn. Not yet implemented.');
            return;
        }

        if (Number(game.gameOptions.playerMode) === PlayerMode.Opponent) {
            const playerQuestion = game.playerQnAs.filter(({ playerId }) => userId.includes(playerId));

            const lastAddedQuestionIndex = game.playerQnAs.findIndex((pastPlayerQnA) =>
                pastPlayerQnA.addedOn === Math.max.apply(Math, playerQuestion.map((o) => { return (o.addedOn) ? o.addedOn : 0 })));
            const lastAddedQuestion = game.playerQnAs[lastAddedQuestionIndex + 1];

            if (!lastAddedQuestion.playerAnswerId) {
                lastAddedQuestion.playerAnswerId = null;
                lastAddedQuestion.answerCorrect = false;
                lastAddedQuestion.playerAnswerInSeconds = 16;
                game.nextTurnPlayerId = game.playerIds.filter((playerId) => playerId !== userId)[0];

                game.playerQnAs[lastAddedQuestionIndex + 1] = lastAddedQuestion;
                const gameMechanics: GameMechanics = new GameMechanics(undefined, undefined);
                let dbGame = '';
                dbGame = game.getDbModel();
                myTurnStatus = false;
                gameMechanics.UpdateGame(dbGame).then((id) => {
                    res.send(undefined);
                });
            }
        }

        if (myTurnStatus) {
            const questionIds = [];
            game.playerQnAs.map((question) => questionIds.push(question.questionId));
            ESUtils.getRandomGameQuestion(game.gameOptions.categoryIds, questionIds).then((question) => {

                const gameMechanics: GameMechanics = new GameMechanics(undefined, undefined);
                let dbGame = '';
                const createdOn = utils.getUTCTimeStamp();
                const playerQnA: PlayerQnA = {
                    playerId: userId,
                    questionId: question.id,
                    addedOn: createdOn
                }
                question.addedOn = createdOn;
                game.playerQnAs.push(playerQnA);
                dbGame = game.getDbModel();
                gameMechanics.UpdateGame(dbGame).then((id) => {
                    res.send(question);
                });
            }).catch(error => {
                console.log('error', error);
                res.status(500).send('Failed to get Q');
                return;
            });
        }

    }).catch(error => {
        res.status(500).send('Uncaught Error');
        return;
    });

};


/**
 * getUpdatedQuestion
 * return question
 */
exports.getUpdatedQuestion = (req, res) => {
    const questionId = req.params.questionId;
    const playerQnA = req.body.playerQnA;

    if (!questionId) {
        res.status(404).send('questionId is not available');
        return;
    }
    questionControllerQuestionService.getQuestionById(questionId).then((qs) => {
        const question = Question.getViewModelFromDb(qs.data());
        if (playerQnA.playerAnswerId !== null) {
            const answerObj = question.answers[playerQnA.playerAnswerId];
            question.userGivenAnswer = answerObj.answerText;
        } else {
            question.userGivenAnswer = null;
        }
        res.send(question);
    })
}
