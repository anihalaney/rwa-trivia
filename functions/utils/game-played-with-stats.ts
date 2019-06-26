import {
    Game, GamePlayedWith
} from '../../projects/shared-library/src/lib/shared/model';
import { UserService } from '../services/user.service';
import { Utils } from '../utils/utils';

export class GamePlayedWithStats {


    static async calculateUserGamePlayedState(game: Game): Promise<any> {
        const gamePlayedPromises = [];

        try {
            gamePlayedPromises.push(GamePlayedWithStats.calculateGamePlayedWithStat(game.playerIds[0], game.playerIds[1], game));
            gamePlayedPromises.push(GamePlayedWithStats.calculateGamePlayedWithStat(game.playerIds[1], game.playerIds[0], game));

            return await Promise.all(gamePlayedPromises);
        } catch (error) {
            return Utils.throwError(error);
        }

    }

    static async calculateGamePlayedWithStat(userId: string, otherUserId: string, game: Game): Promise<string> {
        try {
            let userGameStat: GamePlayedWith = await UserService.getOtherUserGameStatById(userId, otherUserId);
            let gamePlayedWith = new GamePlayedWith();
            if (userGameStat) {
                gamePlayedWith = userGameStat;
            } else {
                gamePlayedWith.date = new Date().getUTCDate();
                gamePlayedWith.created_uid = otherUserId;
            }
                gamePlayedWith.gamePlayed = (gamePlayedWith.gamePlayed) ? Utils.changeFieldValue(1) : 1;
                gamePlayedWith.wins = (gamePlayedWith.wins) ? gamePlayedWith.wins : 0;
                gamePlayedWith.losses = (gamePlayedWith.losses) ? gamePlayedWith.losses : 0;
                if (game.winnerPlayerId) {
                    gamePlayedWith.wins = (game.winnerPlayerId === otherUserId) ?
                            Utils.changeFieldValue(1) : gamePlayedWith.wins;
                    gamePlayedWith.losses = (game.winnerPlayerId !== otherUserId) ?
                            Utils.changeFieldValue(1) : gamePlayedWith.losses;
                }
                userGameStat = { ...gamePlayedWith };
                return await UserService.setGameStat({ ...userGameStat }, userId, otherUserId);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


}
