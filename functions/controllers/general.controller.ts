import { GeneralConstants, interceptorConstants } from '../../projects/shared-library/src/lib/shared/model';
import { GeneralService } from '../services/general.service';
import { Utils } from '../utils/utils';
import { AppSettings } from '../services/app-settings.service';
import { ESUtils } from '../utils/ESUtils';
import { StatsService } from '../services/stats.service';

export class GeneralController {
    private static QUESTIONS_INDEX = 'questions';
    /**
     * helloOperation
     * return status
     */
    static helloOperation(req, res) {
        Utils.sendResponse(res, interceptorConstants.SUCCESS, `${GeneralConstants.HELLO} ${req.user.email}`);
    }

    /**
     * getTestQuestion
     * return status
     */
    static async getTestQuestion(req, res): Promise<any> {
        try {
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await GeneralService.getTestQuestion());
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * getGameQuestionTest
     * return status
     */
    static async getGameQuestionTest(req, res): Promise<any> {
        try {
            Utils.sendResponse(res, interceptorConstants.SUCCESS, await GeneralService.getGameQuestionTest());
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * getGameQuestionTest
     * return status
     */
    static testES(req, res) {
        GeneralService.testES(res);
    }

    /**
 * getTestQuestion
 * return status
 */
    static async updateAppVersion(req, res): Promise<any> {
        try {
            Utils.sendResponse(res, interceptorConstants.SUCCESS,
                await AppSettings.Instance.updateAppVersion(req.body.versionCode, req.body.platform));
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
* getCategory
* return category and tags
*/
    static async getTopCategories(req, res) {
        try {
            const requestResponse = await ESUtils.getTopCategories(GeneralController.QUESTIONS_INDEX);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, requestResponse);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    static async getTopTags(req, res) {
        try {
            const requestResponse = await ESUtils.getTopTags(GeneralController.QUESTIONS_INDEX);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, requestResponse);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    static async updateStat(req, res) {
        try {
            const afterEventData = req.body.afterEventData;
            const beforeEventData = req.body.beforeEventData;
            console.log(afterEventData.playerQnAs  &&
                ( !(beforeEventData && beforeEventData.playerQnAs) ||
                    (  beforeEventData.playerQnAs && afterEventData.playerQnAs.length !== beforeEventData.playerQnAs.length )
                ));

                // update timestamp in user last played game with
            if (afterEventData.playerQnAs  && afterEventData.playerQnAs &&
                afterEventData.playerQnAs.length > 0 &&
                afterEventData.playerQnAs[afterEventData.playerQnAs.length - 1] &&
                (typeof afterEventData.playerQnAs[afterEventData.playerQnAs.length - 1].answerCorrect === 'boolean') &&
                afterEventData.gameOptions && afterEventData.gameOptions.playerMode == '1' &&
                ( afterEventData.gameOptions.opponentType == '0' || afterEventData.gameOptions.opponentType == '1' ) &&
                ( !(beforeEventData && beforeEventData.playerQnAs) || // allow when user is the first to answer the question
                        (afterEventData.playerIds &&  beforeEventData && beforeEventData.playerIds &&
                             beforeEventData.playerIds.length !== afterEventData.playerIds.length &&
                              afterEventData.gameOptions.opponentType == '0') ||  // allow if the game is with random player and the random user has been selected
                    (  beforeEventData.playerQnAs &&
                        (afterEventData.playerQnAs.length !== beforeEventData.playerQnAs.length ||
                      ( afterEventData.playerQnAs.length === beforeEventData.playerQnAs.length &&
                        typeof beforeEventData.playerQnAs[afterEventData.playerQnAs.length - 1].answerCorrect === 'undefined' ))) // allow if any of the player has answered the question
                ) &&
                afterEventData.playerIds && afterEventData.playerIds.length >= 2
               ) {
                    const lastAnsweredStat = afterEventData.playerQnAs[(afterEventData.playerQnAs.length - 1)];
                    if ( lastAnsweredStat && lastAnsweredStat.playerId) {
                        const otherUserId = afterEventData.playerId_0 !== lastAnsweredStat.playerId ?
                                            afterEventData.playerId_0 : afterEventData.playerId_1;
                                            console.log('here  ===== .');
                                            console.log(otherUserId);
                                            console.log(lastAnsweredStat.playerId);
                        await StatsService.updateUserPlayedGameStats(lastAnsweredStat.playerId, otherUserId, 'current_user');
                        await StatsService.updateUserPlayedGameStats(otherUserId, lastAnsweredStat.playerId, 'other_user');
                    }
                }

            Utils.sendResponse(res, interceptorConstants.SUCCESS, 'updated');
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

}
