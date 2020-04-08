import { ESUtils } from '../utils/ESUtils';
import {
    SearchCriteria, Game, PlayerQnA, Question,
    PlayerMode, QuestionStatus, interceptorConstants, ResponseMessagesConstants, CollectionConstants, QuestionsConstants,
    HeaderConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { GameMechanics } from '../utils/game-mechanics';
import { Utils } from '../utils/utils';
import { QuestionService } from '../services/question.service';
import { GameService } from '../services/game.service';
import { StatsService } from '../services/stats.service';
import { AppSettings } from '../services/app-settings.service';

export class QuestionController {

    /**
     * getQuestionOfDay
     * return question of the day
     */
    static async getQuestionOfDay(req, res): Promise<any> {
        try {
            const isNextQuestion = (req.params.nextQ && req.params.nextQ === QuestionsConstants.NEXT) ? true : false;
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await ESUtils.getRandomQuestionOfTheDay(isNextQuestion));
        } catch (error) {
            Utils.sendError(res, error);
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
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await ESUtils.getQuestions(start, size, criteria));
        } catch (error) {
            Utils.sendError(res, error);
        }
    }


    /**
     * getNextQuestion
     * return question
     */
    static async getNextQuestion(req, res): Promise<any> {

        try {
            const userId = req.user.uid;
            const gameId = req.params.gameId;
            const g = await GameService.getGameById(gameId);
            if (!g) {
                // game not found
                Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.GAME_NOT_FOUND);
            }

            const game: Game = g;

            if (game.playerIds.indexOf(userId) < 0) {
                // user not part of this game
                Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.USER_NOT_PART_OF_GAME);
            }

            if (game.gameOver) {
                // gameOver
                Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.GAME_OVER);
            }

            if (game.gameOptions.gameMode !== 0) {
                // Multiplayer mode - check whose turn it is. Not yet implemented
                Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.WAIT_FOR_YOUR_TURN);
            }

            const status = await GameMechanics.changeTheTurn(game);
            if (status) {
                const questionIds = [];
                let attemptedCategories = [];
                for (const questionObj of game.playerQnAs) {
                    questionIds.push(questionObj.questionId);
                    if (questionObj.categoryId && questionObj.categoryId.length > 0 && questionObj.badge && questionObj.badge.won) {
                        if (Number(game.gameOptions.playerMode) === PlayerMode.Single ||
                        (Number(game.gameOptions.playerMode) === PlayerMode.Opponent && questionObj.playerId === userId)) {
                            attemptedCategories =
                            [...new Set([ ...attemptedCategories, ...questionObj.categoryId.map(data => Number(data))])];
                        }
                    }
                }
                const remainingCategories = game.gameOptions.categoryIds.filter(data => attemptedCategories.indexOf(data) === -1);
                const question = await ESUtils.getRandomGameQuestion(remainingCategories, questionIds, attemptedCategories);
                const createdOn = Utils.getUTCTimeStamp();
                const playerQnA: PlayerQnA = {
                    playerId: userId,
                    questionId: question.id,
                    addedOn: createdOn,
                };
                if (game.gameOptions.isBadgeWithCategory && game.gameOptions.isBadgeWithCategory === true) {
                    const appSetting = await AppSettings.Instance.getAppSettings();
                    playerQnA.categoryId = question.categoryIds;
                    const earnedBadges = game.stats && game.stats[userId] && game.stats[userId].badge ? game.stats[userId].badge : [];
                    const remainingBadges = [];
                    let isBadgeWonWithQuestionCategory = false;
                    for (const badgeObj in appSetting.badges) {
                        if (appSetting.badges.hasOwnProperty(badgeObj)) {
                            if (appSetting.badges[badgeObj].category > 0 &&
                                Number(appSetting.badges[badgeObj].category) ===  Number(question.categoryIds[0])) {
                                isBadgeWonWithQuestionCategory = true;
                            }
                            if (earnedBadges.indexOf(badgeObj) === -1) {
                                if (appSetting.badges[badgeObj].category > 0 &&
                                    Number(appSetting.badges[badgeObj].category) ===  Number(question.categoryIds[0])) {
                                        playerQnA.badge  = { name: badgeObj, won: false};
                                } else if (appSetting.badges[badgeObj].category === 0) {
                                    remainingBadges.push(badgeObj);
                                }
                            }
                        }
                    }
                    if (!playerQnA.badge && remainingBadges.length > 0 && !isBadgeWonWithQuestionCategory) {
                        playerQnA.badge = { name: remainingBadges[Math.floor(Math.random() * remainingBadges.length)], won: false };
                    }
                    question.badge = playerQnA.badge;
                }
                if (game.playerQnAs.length > 0) {
                    if (Number(game.gameOptions.playerMode) === PlayerMode.Single &&
                            (!game.gameOptions.isBadgeWithCategory ||
                                (game.gameOptions.isBadgeWithCategory &&
                                    !(!game.playerQnAs[game.playerQnAs.length - 1].badge && game.playerQnAs[game.playerQnAs.length - 1].answerCorrect === true
                                    )
                                )
                            )
                    ) {
                        game.round = game.round + 1;
                    }
                }

                playerQnA.round = game.round;
                question.gameRound = game.round;
                question.addedOn = createdOn;
                question.serverTimeQCreated = createdOn;

                game.playerQnAs.push(playerQnA);
                const dbGame = game.getDbModel();
                await GameService.setGame(dbGame);
                Utils.sendResponse(res, interceptorConstants.SUCCESS, question);
            } else {
                const newQuestion = await ESUtils.getQuestionById(game.playerQnAs[game.playerQnAs.length - 1].questionId);
                newQuestion.gameRound = game.round;
                const createdOn = Utils.getUTCTimeStamp();
                newQuestion.serverTimeQCreated = createdOn;
                Utils.sendResponse(res, interceptorConstants.SUCCESS, newQuestion);
            }
        } catch (error) {
            Utils.sendError(res, error);
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
                Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.QUESTION_ID_IS_NOT_AVAILABLE);
            }
            const question: Question = await QuestionService.getQuestionById(questionId);
            if (playerQnA.playerAnswerId && playerQnA.playerAnswerId !== null) {
                const answerObj = question.answers[playerQnA.playerAnswerId];
                question.userGivenAnswer = answerObj.answerText;
                question.badge = playerQnA.badge;
            } else {
                question.userGivenAnswer = null;
            }
            Utils.sendResponse(res, interceptorConstants.SUCCESS, question);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }


    /**
     * changeUnpublishedQuestionStatus
     * return status
     */
    static async changeUnpublishedQuestionStatus(req, res): Promise<any> {

        try {
            const questions: Question[] = await QuestionService.getQuestion(CollectionConstants.UNPUBLISHED_QUESTIONS);
            const questionUpdatePromises = [];
            for (const questionObj of questions) {
                if (questionObj.status === QuestionStatus.SUBMITTED) {
                    questionObj.status = QuestionStatus.PENDING;
                    const dbQuestion = { ...questionObj };
                    questionUpdatePromises.push(QuestionService.updateQuestion(CollectionConstants.UNPUBLISHED_QUESTIONS, dbQuestion));
                }
            }
            await Promise.all(questionUpdatePromises);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UNPUBLISHED_STATUS_CHANGED);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    static async uploadQuestionImage(req, res): Promise<any> {
        const questionImage = req.body.image;
        const userId = req.user.uid;
        if (questionImage) {
            const imageName = new Date().getTime();
            await QuestionService.uploadImage(questionImage, imageName, userId);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, { name: imageName });
        } else {
            Utils.sendResponse(res, interceptorConstants.SUCCESS, ResponseMessagesConstants.UNPUBLISHED_STATUS_CHANGED);
        }
    }

    static async getQuestionImage(req, res): Promise<any> {
        const imageName = req.params.imageName;
        if (imageName) {
            try {

                const stream = await QuestionService.generateQuesitonImage(imageName);
                res.setHeader(HeaderConstants.CONTENT_DASH_DISPOSITION,
                    HeaderConstants.ATTACHMENT_QUESTION_IMAGE_PNG);
                res.setHeader(HeaderConstants.CONTENT_DASH_TYPE, HeaderConstants.IMAGE_FORWARD_SLASH_JPEG);
                Utils.sendResponse(res, interceptorConstants.SUCCESS, stream);
            } catch (error) {
                Utils.sendError(res, error);
            }
        } else {
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.BAD_REQUEST);
        }
    }

    /**
     * update question state
     * return status
     */
    static async updateQuestionStat(req, res) {
        try {
            const questionId = req.body.questionId;
            const type = req.body.type;
            const update = req.body.update;
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await StatsService.updateQuestionStats(questionId, type, update));
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    static async deleteQuestionImage(req, res) {
        const imageName = req.params.imageName;
        const userId = req.user.uid;
        if (imageName) {
            try {
                const result  = await QuestionService.deleteQuestionImage(imageName,userId)
                Utils.sendResponse(res, interceptorConstants.SUCCESS, result);
            } catch (error) {
                Utils.sendError(res, error);
            }
        } else {
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.BAD_REQUEST);
        }
    }


}
