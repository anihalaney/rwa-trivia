import {
    Game, GamePlayedWithMetadata
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
            let userGameStat: GamePlayedWithMetadata = await UserService.getOtherUserGameStatById(userId, otherUserId);
            let gamePlayedWithMetadata = new GamePlayedWithMetadata();
            if (userGameStat) {
                gamePlayedWithMetadata = userGameStat;
            } else {
                gamePlayedWithMetadata.date = new Date().getUTCDate();
                gamePlayedWithMetadata.created_uid = otherUserId;
            }
                gamePlayedWithMetadata.gamePlayed = (gamePlayedWithMetadata.gamePlayed) ? gamePlayedWithMetadata.gamePlayed + 1 : 1;
                gamePlayedWithMetadata.wins = (gamePlayedWithMetadata.wins) ? gamePlayedWithMetadata.wins : 0;
                gamePlayedWithMetadata.losses = (gamePlayedWithMetadata.losses) ? gamePlayedWithMetadata.losses : 0;
                if (game.winnerPlayerId) {
                    gamePlayedWithMetadata.wins = (game.winnerPlayerId === otherUserId) ?
                             gamePlayedWithMetadata.wins + 1 : gamePlayedWithMetadata.wins;
                    gamePlayedWithMetadata.losses = (game.winnerPlayerId !== otherUserId) ?
                             gamePlayedWithMetadata.losses + 1 : gamePlayedWithMetadata.losses;
                }
                userGameStat = { ...gamePlayedWithMetadata };
                return await UserService.setGameStat({ ...userGameStat }, userId, otherUserId);
        } catch (error) {
            return Utils.throwError(error);
        }
    }


}
