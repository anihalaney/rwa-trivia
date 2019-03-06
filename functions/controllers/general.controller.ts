import { GeneralService } from '../services/general.service';

export class GeneralController {
    /**
         * helloOperation
         * return status
         */
    static helloOperation(req, res) {
        res.status(200).send(`Hello ${req.user.email}`);
    }


    /**
     * getTestQuestion
     * return status
     */
    static async getTestQuestion(req, res): Promise<any> {
        try {
            res.status(200).send(await GeneralService.getTestQuestion());
        } catch (error) {
            console.error('Error', error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }


    /**
     * getGameQuestionTest
     * return status
     */
    static async getGameQuestionTest(req, res): Promise<any> {
        try {
            res.status(200).send(await GeneralService.getGameQuestionTest());
        } catch (error) {
            console.error('Error', error);
            res.status(500).send('Internal Server error');
            return error;
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
