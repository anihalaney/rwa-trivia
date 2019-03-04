import { ESUtils } from '../utils/ESUtils';
import { SearchCriteria, Game, PlayerQnA, Question, PlayerMode, QuestionStatus } from '../../projects/shared-library/src/lib/shared/model';
import { GameMechanics } from '../utils/game-mechanics';
import { Utils } from '../utils/utils';
import { QuestionService } from '../services/question.service';
import { GameService } from '../services/game.service';

export class QuestionController {
    private static utils: Utils = new Utils();
    /**
     * getQuestionOfDay
     * return question of the day
     */
    static async getQuestionOfDay(req, res): Promise<any> {

        try {
            const isNextQuestion = (req.params.nextQ && req.params.nextQ === 'next') ? true : false;
            res.status(200).send(await ESUtils.getRandomQuestionOfTheDay(isNextQuestion));
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

    /**
     * getQuestions
     * return questions
     */
    static async getQuestions(req, res): Promise<any> {
        try {
            // Admins can get all Qs, while authorized users can only get Qs created by them
            // TODO: For now restricting it to admins only till we add security
            const start = req.params.start;
            const size = req.params.size;
            const criteria: SearchCriteria = req.body;
            console.log(criteria);
            res.status(200).send(await ESUtils.getQuestions(start, size, criteria));
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }


    }


    /**
     * getNextQuestion
     * return question
     */
    static async getNextQuestion(req, res): Promise<any> {
        // console.log(req.user.uid);
        // console.log(req.params.gameId);
        try {
            const userId = req.user.uid;
            const gameId = req.params.gameId;
            const g = await GameService.getGameById(gameId);

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

            console.log('game---->', game);

            const gameMechanics: GameMechanics = new GameMechanics(undefined, undefined);

            const status = await gameMechanics.changeTheTurn(game);
            if (status) {
                const questionIds = [];
                for (const questionObj of game.playerQnAs) {
                    questionIds.push(questionObj.questionId);
                }
                const question = await ESUtils.getRandomGameQuestion(game.gameOptions.categoryIds, questionIds);
                const createdOn = this.utils.getUTCTimeStamp();
                const playerQnA: PlayerQnA = {
                    playerId: userId,
                    questionId: question.id,
                    addedOn: createdOn
                };

                if (game.playerQnAs.length > 0) {
                    if (Number(game.gameOptions.playerMode) === PlayerMode.Single) {
                        game.round = game.round + 1;
                    }
                }

                playerQnA.round = game.round;
                question.gameRound = game.round;
                question.addedOn = createdOn;
                game.playerQnAs.push(playerQnA);
                const dbGame = game.getDbModel();
                //  console.log('update the question ---->', question);
                await gameMechanics.UpdateGame(dbGame);
                res.send(question);
            } else {
                const newQuestion = await ESUtils.getQuestionById(game.playerQnAs[game.playerQnAs.length - 1].questionId);
                newQuestion.gameRound = game.round;
                res.send(newQuestion);
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }


    /**
     * getUpdatedQuestion
     * return question
     */
    static async getUpdatedQuestion(req, res): Promise<any> {

        try {
            const questionId = req.params.questionId;
            const playerQnA = req.body.playerQnA;

            if (!questionId) {
                res.status(404).send('questionId is not available');
                return;
            }
            const qs = await QuestionService.getQuestionById(questionId);
            const question = Question.getViewModelFromDb(qs.data());
            if (playerQnA.playerAnswerId && playerQnA.playerAnswerId !== null) {
                const answerObj = question.answers[playerQnA.playerAnswerId];
                question.userGivenAnswer = answerObj.answerText;
            } else {
                question.userGivenAnswer = null;
            }
            res.send(question);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }


    }


    /**
     * changeUnpublishedQuestionStatus
     * return status
     */
    static async changeUnpublishedQuestionStatus(req, res): Promise<any> {

        try {
            const questions = await QuestionService.getQuestion('unpublished_questions');
            const questionUpdatePromises = [];
            questions.docs.map((question) => {
                const questionObj: Question = question.data();
                if (questionObj.status === QuestionStatus.SUBMITTED) {
                    questionObj.status = QuestionStatus.PENDING;
                    const dbQuestion = { ...questionObj };
                    console.log('dbQuestion', dbQuestion);
                    questionUpdatePromises.push(QuestionService.updateQuestion('unpublished_questions', dbQuestion));
                }
            });
            await Promise.all(questionUpdatePromises);
            res.send('unpublished status changed');
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }


}
