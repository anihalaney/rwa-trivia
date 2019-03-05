import {
    Game, GameStatus, OpponentType, pushNotificationRouteConstants, schedulerConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { GameService } from '../services/game.service';
import { GameMechanics } from '../utils/game-mechanics';
import { PushNotification } from '../utils/push-notifications';
import { Utils } from '../utils/utils';

export class SchedulerController {

    private static pushNotification: PushNotification = new PushNotification();

    /* checkGameOver
    * return status
    */
   static async checkGameOver(req, res) {
       try {
           await GameMechanics.doGameOverOperations();
       } catch (error) {
           console.error('Error : ', error);
       }
       return res.status(200).send('scheduler check is completed');
   }

    /**
     * checkGameTurn
     * return status
     */
    static async changeGameTurn(req, res) {
        try {
            const games: Game[] = await GameService.checkGameOver();
            const promises = [];
            for (const game of games) {
                promises.push(GameMechanics.changeTheTurn(game));
            }
            await Promise.all(promises);
        } catch (error) {
            console.error('Error : ', error);
        }
        return res.status(200).send('scheduler check is completed');
    }

}
