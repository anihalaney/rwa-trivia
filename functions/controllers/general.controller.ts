import { GeneralConstants, interceptorConstants } from '../../projects/shared-library/src/lib/shared/model';
import { GeneralService } from '../services/general.service';
import { Utils } from '../utils/utils';

export class GeneralController {

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

}
