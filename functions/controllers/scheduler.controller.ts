import {
    Game, GameStatus, OpponentType, pushNotificationRouteConstants, schedulerConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { SchedulerService } from '../services/scheduler.service';
import { GameMechanics } from '../utils/game-mechanics';
import { PushNotification } from '../utils/push-notifications';
import { Utils } from '../utils/utils';

export class SchedulerController {

    private static pushNotification: PushNotification = new PushNotification();

    /**
     * checkGameOver
     * return status
     */
    static async checkGameOver(req, res) {
        try {
            const snapshot = await SchedulerService.checkGameOver();
            for (const doc of snapshot) {

                const game: Game = Game.getViewModel(doc.data());
                const millis = Utils.getUTCTimeStamp();
                const noPlayTimeBound = (millis > game.turnAt) ? millis - game.turnAt : game.turnAt - millis;
                const playedHours = Math.floor((noPlayTimeBound) / (1000 * 60 * 60));
                const playedMinutes = Math.floor((noPlayTimeBound) / (1000 * 60));

                let remainedTime;
                if (playedMinutes > schedulerConstants.beforeGameExpireDuration) {
                    remainedTime = playedMinutes - schedulerConstants.beforeGameExpireDuration;
                } else {
                    remainedTime = schedulerConstants.beforeGameExpireDuration - playedMinutes;
                }

                if ((Number(game.gameOptions.opponentType) === OpponentType.Random) ||
                    (Number(game.gameOptions.opponentType) === OpponentType.Friend)) {
                    if ((remainedTime) <= schedulerConstants.notificationInterval) {
                        this.pushNotification.sendGamePlayPushNotifications(game, game.nextTurnPlayerId,
                            pushNotificationRouteConstants.GAME_REMAINING_TIME_NOTIFICATIONS);
                    }
                }

                if (playedHours >= schedulerConstants.gamePlayDuration) {
                    game.gameOver = true;
                    game.winnerPlayerId = game.playerIds.filter(playerId => playerId !== game.nextTurnPlayerId)[0];
                    game.GameStatus = GameStatus.TIME_EXPIRED;
                    if ((Number(game.gameOptions.opponentType) === OpponentType.Random) ||
                        (Number(game.gameOptions.opponentType) === OpponentType.Friend)) {
                        this.pushNotification.sendGamePlayPushNotifications(game, game.winnerPlayerId,
                            pushNotificationRouteConstants.GAME_PLAY_NOTIFICATIONS);
                    }
                    const dbGame = game.getDbModel();
                    await SchedulerService.updateGame(dbGame);
                    console.log('updated game', dbGame.id);
                } else if (playedHours >= schedulerConstants.gameInvitationDuration
                    && (game.GameStatus === GameStatus.WAITING_FOR_FRIEND_INVITATION_ACCEPTANCE ||
                        game.GameStatus === GameStatus.WAITING_FOR_RANDOM_PLAYER_INVITATION_ACCEPTANCE)) {
                    game.gameOver = true;
                    game.GameStatus = GameStatus.INVITATION_TIMEOUT;
                    const dbGame = game.getDbModel();
                    await SchedulerService.updateGame(dbGame);
                    console.log('invitation expires', dbGame.id);
                }
            }

            return res.status(200).send('scheduler check is completed');
        } catch (error) {
            console.error('Error : ', error);
            res.status(200).send('Internal Server error');
            return error;
        }
    }

    /**
     * checkGameTurn
     * return status
     */
    static async changeGameTurn(req, res) {
        try {
            const snapshot = await SchedulerService.checkGameOver();
            for (const doc of snapshot) {
                const game: Game = Game.getViewModel(doc.data());
                const status = await GameMechanics.changeTheTurn(game);
                console.log('game update status', status, game.gameId);
            }
            return res.status(200).send('scheduler check is completed');
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

}
