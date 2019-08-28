import { GeneralConstants, interceptorConstants } from '../../projects/shared-library/src/lib/shared/model';
import { GeneralService } from '../services/general.service';
import { Utils } from '../utils/utils';
import { AppSettings } from '../services/app-settings.service';
import { ESUtils } from '../utils/ESUtils';

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


}
