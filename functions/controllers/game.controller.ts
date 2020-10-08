import {
    Account, Game, GameOperations, HeaderConstants, interceptorConstants, PlayerQnA, ResponseMessagesConstants, appConstants
} from '../../projects/shared-library/src/lib/shared/model';
import { AccountService } from '../services/account.service';
import { AppSettings } from '../services/app-settings.service';
import { GameService } from '../services/game.service';
import { SocialService } from '../services/social.service';
import { GameMechanics } from '../utils/game-mechanics';
import { Utils } from '../utils/utils';

export class GameController {

    /**
     * createGame
     * return gameId
     */
    static async createGame(req, res) {
        try {
            const gameOptions = req.body.gameOptions;
            const userId = req.body.userId;

            if (!gameOptions) {
                // Game Option is not added
                Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.GAME_OPTION_NOT_FOUND);
            }
            gameOptions.isBadgeWithCategory = true;
            if (!userId) {
                // userId is not added
                Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.USER_ID_NOT_FOUND);
            }


            // Get App Settings
            const appSetting = await AppSettings.Instance.getAppSettings();

            const account: Account = await AccountService.getAccountById(userId);
            if (appSetting.lives.enable) {
                // Get Account Info
                if (!account.signUpQuestionAnswered) {
                    await AccountService.updateBits(userId, appSetting.game_question_bits);
                    account.signUpQuestionAnswered = true;
                    await AccountService.updateAccountData(account);
                } else {
                    // Decrement lives from user account
                    AccountService.decreaseLife(userId);
                    // Decrement Second Player's life
                    if (gameOptions.friendId) {
                        AccountService.decreaseLife(gameOptions.friendId);
                    }
                }
                // if lives is less then or equal to 0 then send with error
                if (account.lives <= 0) {
                    Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.NOT_ENOUGH_LIFE);
                }
            }

            const gameId = await GameMechanics.createNewGame(userId, gameOptions);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, { gameId: gameId });
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * updateGame
     * return
     */
    static async updateGame(req, res) {
        const gameId = req.params.gameId;

        const operation = req.body.operation;
        const playerQnA: PlayerQnA = req.body.playerQnA;
        const userId = req.user.uid;

        if (!gameId) {
            // gameId
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.GAME_ID_NOT_FOUND);
        }

        if (!operation) {
            // operation
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.OPERATION_NOT_FOUND);
        }

        try {

            const g = await GameService.getGameById(gameId);

            if (!g) {
                // game not found
                Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.GAME_NOT_FOUND);
            }

            const game: Game = g;

            if (game.playerIds.indexOf(req.user.uid) === -1) {
                // operation
                Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.UNAUTHORIZED);
            }

            if ((operation === GameOperations.CALCULATE_SCORE || operation === GameOperations.REPORT_STATUS) && !playerQnA) {
                // playerQnA
                Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.PLAYER_QNA_NOT_FOUND);
            }

            await GameMechanics.doGameOperations(userId, playerQnA, game, operation);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, {});
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * createSocialContent
     * return htmlcontent
     */
    static async createSocialContent(req, res) {

        const websiteUrl = Utils.getWebsiteUrl();
        const imageUrl = `${websiteUrl}/${appConstants.API_VERSION}/game/social-image/${req.params.userId}/${req.params.socialId}`;

        const htmlContent = `<!DOCTYPE html>
                               <html>
                                <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb#">
                                  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                                  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=contain">
                                  <meta property="og:locale" content="en_US" />
                                  <meta property="og:type" content="article" />
                                  <meta property="og:title" content="Bitwiser Game Score">
                                  <meta property="og:description" content="Bitwiser Game Score">
                                  <meta property="og:url"  content="${imageUrl}">
                                  <meta property="og:image" content="${imageUrl}">
                                  <meta name="twitter:card" content="summary_large_image"/>
                                  <meta name="twitter:title" content="Bitwiser Game Score"/>
                                  <meta name="twitter:description" content="Bitwiser Game Score">
                                  <meta name="twitter:site" content="@${websiteUrl}"/>
                                  <meta name="twitter:image" content="${imageUrl}"/>
                                </head>
                                <body>
                                 <img src="${imageUrl}" />
                                </body>
                              </html>`;

        res.setHeader(HeaderConstants.CONTENT_DASH_TYPE, HeaderConstants.TEXT_FORWARD_SLASH_HTML);
        Utils.sendResponse(res, interceptorConstants.SUCCESS, htmlContent);
    }

    /**
     * createSocialImage
     * return file
     */
    static async createSocialImage(req, res) {
        try {
            const socialId = req.params.socialId;
            const social_url = await SocialService.generateSocialUrl(req.params.userId, socialId);
            res.setHeader(HeaderConstants.CONTENT_DASH_DISPOSITION,
                HeaderConstants.ATTACHMENT_SEMI_COLON_FILE_NAME_EQUAL_TO_SOCIAL_UNDER_SCORE_IMAGE_DOT_PNG);
            res.setHeader(HeaderConstants.CONTENT_DASH_TYPE, HeaderConstants.IMAGE_FORWARD_SLASH_PNG);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, social_url);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

}
