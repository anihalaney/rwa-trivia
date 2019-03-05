import { Game, GameOperations, PlayerQnA } from '../../projects/shared-library/src/lib/shared/model';
import { AppSettings } from '../services/app-settings.service';
import { GameService } from '../services/game.service';
import { GameMechanics } from '../utils/game-mechanics';
import { AccountService } from '../services/account.service';
import { SocialService } from '../services/social.service';
import * as functions from 'firebase-functions';

export class GameController {

    /**
     * createGame
     * return gameId
     */
    static async createGame(req, res) {
        const appSettings: AppSettings = new AppSettings();
        try {
            const gameOptions = req.body.gameOptions;
            const userId = req.body.userId;

            if (!gameOptions) {
                // Game Option is not added
                res.status(400).send('Game Option is not added in request');
                return;
            }

            if (!userId) {
                // userId
                res.status(400).send('userId is not added in request');
                return;
            }


            // Get App Settings
            const appSetting = await appSettings.getAppSettings();

            if (appSetting.lives.enable) {
                // Get Account Info
                const account = await AccountService.getAccountById(userId);
                // if lives is less then or equal to 0 then send with error
                if (account.data().lives <= 0) {
                    res.status(403).send('Sorry, don\'t have enough life.');
                    return;
                }
            }

            const gameId = await GameMechanics.createNewGame(userId, gameOptions);

            if (appSetting.lives.enable) {
                // Decrement lives from user account
                AccountService.decreaseLife(userId);
                // Decrement Second Player's life
                if (gameOptions.friendId) {
                    AccountService.decreaseLife(gameOptions.friendId);
                }
            }
            return res.status(200).send({ gameId: gameId });

        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
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
            res.status(400).send('gameId is not added in request');
            return;
        }

        if (!operation) {
            // operation
            res.status(400).send('operation is not added in request');
            return;
        }

        try {

            const g = await GameService.getGameById(gameId);

            if (!g) {
                // game not found
                res.status(400).send('Game not found');
                return;
            }

            const game: Game = g;

            if (game.playerIds.indexOf(req.user.uid) === -1) {
                // operation
                res.status(403).send('Unauthorized');
                return;
            }

            if ((operation === GameOperations.CALCULATE_SCORE || operation === GameOperations.REPORT_STATUS) && !playerQnA) {
                // playerQnA
                res.status(400).send('playerQnA not found');
                return;
            }

            await GameMechanics.doGameOperations(userId, playerQnA, game, operation);

            return res.status(200).send({});

        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

    /**
     * updateAllGame
     * return status
     */
    static async updateAllGame(req, res) {
        try {
            await GameService.updateStats();
            return res.status(200).send('loaded data');

        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

    /**
     * createSocialContent
     * return htmlcontent
     */
    static async createSocialContent(req, res) {

        let websiteUrl = `https://`;

        if (functions.config().elasticsearch &&
            functions.config().elasticsearch.index &&
            functions.config().elasticsearch.index.production &&
            functions.config().elasticsearch.index.production === 'true') {
            websiteUrl += 'bitwiser.io';
        } else {
            websiteUrl += 'rwa-trivia-dev-e57fc.firebaseapp.com';
        }

        const imageUrl = `${websiteUrl}/app/game/social-image/${req.params.userId}/${req.params.socialId}`;

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

        res.setHeader('content-type', 'text/html');
        return res.status(200).send(htmlContent);
    }

    /**
     * createSocialImage
     * return file
     */
    static async createSocialImage(req, res) {
        try {
            const socialId = req.params.socialId;
            const social_url = await SocialService.generateSocialUrl(req.params.userId, socialId);
            res.setHeader('content-disposition', 'attachment; filename=social_image.png');
            res.setHeader('content-type', 'image/png');
            return res.status(200).send(social_url);
        } catch (error) {
            console.error('Error : ', error);
            res.status(200, 'Internal Server error');
            return error;
        }
    }

}
