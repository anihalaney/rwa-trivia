import { UserService } from '../services/user.service';
import { ProfileImagesGenerator } from '../utils/profile-images-generator';
import { MailClient } from '../utils/mail-client';
import {
    UserControllerConstants, profileSettingsConstants,
    interceptorConstants,
    ResponseMessagesConstants,
    UserConstants,
    HeaderConstants,
    User,
    Account
} from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from '../utils/utils';
import { AccountService } from '../services/account.service';
import { externalUrl } from '../../projects/shared-library/src/lib/environments/external-url';
import { AppSettings } from './../services/app-settings.service';


import * as requestPromise from 'request-promise';
export class UserController {


    /**
     * getUserById
     * return user
     */
    static async getUserById(req, res) {
        const userId = req.params.userId;

        if (!userId) {
            // userId is not available
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.USER_ID_NOT_FOUND);
        }
        try {
            const loggedInUser = req && req.user && req.user.uid ? req.user.uid : '';
            Utils.sendResponse(res, interceptorConstants.SUCCESS,
                await UserService.getUserProfile(userId, loggedInUser));
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * getUserImages
     * return user
     */
    static async getUserImages(req, res) {
        const userId = req.params.userId;
        const width = req.params.width;
        const height = req.params.height;


        if (!userId) {
            // userId is not available
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.USER_ID_NOT_FOUND);
        }

        if (!width) {
            // width is not available
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.WIDTH_NOT_FOUND);
        }

        if (!height) {
            // height is not available
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.HEIGHT_NOT_FOUND);
        }


        try {
            const stream = await UserService.getUserProfileImage(userId, width, height);
            res.setHeader(HeaderConstants.CONTENT_DASH_DISPOSITION,
                HeaderConstants.ATTACHMENT_SEMI_COLON_FILE_NAME_EQUAL_TO_PROFILE_UNDER_SCORE_IMAGE_DOT_PNG);
            res.setHeader(HeaderConstants.CONTENT_DASH_TYPE, HeaderConstants.IMAGE_FORWARD_SLASH_JPEG);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, stream);
        } catch (error) {
            Utils.sendError(res, error);
        }

    }

    /**
     * generateUserProfileImage
     * return status
     */
    static async generateUserProfileImage(req, res) {
        if (!req.body.user || !req.body.user.userId || req.body.user.userId !== req.user.uid) {
            Utils.sendResponse(res, interceptorConstants.UNAUTHORIZED, ResponseMessagesConstants.UNAUTHORIZED);
        }


        let user = req.body.user;

        try {
            if (user.profilePicture && user.croppedImageUrl && user.originalImageUrl) {

                user = await ProfileImagesGenerator.uploadProfileImage(user);

                delete user.originalImageUrl;
                delete user.croppedImageUrl;
                delete user.imageType;
            }

            if (user.bulkUploadPermissionStatus === profileSettingsConstants.NONE) {
                user.bulkUploadPermissionStatus = profileSettingsConstants.PENDING;
                user.bulkUploadPermissionStatusUpdateTime = Utils.getUTCTimeStamp();
                const htmlContent = `<b>${user.displayName}</b> user with id <b>${user.userId}</b> has requested bulk upload access.`;
                try {
                    const mail: MailClient = new MailClient(UserControllerConstants.adminEmail, UserControllerConstants.mailSubject,
                        UserControllerConstants.mailSubject, htmlContent);
                    await mail.sendMail();
                } catch (error) {
                    console.error('mail error', error);
                }
            }

            const geoPoint = await UserService.getGeoCode(user.geoPoint);
            if (geoPoint) {
                user.geoPoint = geoPoint;
            }

            delete user[UserConstants.ROLES];

            await UserService.updateUser({ ...user });

            Utils.sendResponse(res, interceptorConstants.SUCCESS, { 'status': ResponseMessagesConstants.PROFILE_DATA_IS_SAVED });

        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
     * updateLives
     * return status
     */
    static async updateLives(req, res) {
        const userId = req.body.userId;

        if (!userId) {
            Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.USER_ID_NOT_FOUND);
        }

        if (req.user.user_id !== userId) {
            Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.UNAUTHORIZED);
        }

        try {
            await AccountService.updateLives(userId);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, { 'status': ResponseMessagesConstants.LIVES_ADDED });

        } catch (error) {
            Utils.sendError(res, error);
        }

    }

    /**
  * getUserById
  * return user
  */
    static async getUserProfileById(req, res) {
        const userId = req.params.userId;
        if (!userId) {
            // userId is not available
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.USER_ID_NOT_FOUND);
        }
        try {
            const extendedInfo = true;
            const loggedInUser = req && req.user && req.user.uid ? req.user.uid : '';
            Utils.sendResponse(res, interceptorConstants.SUCCESS,
                await UserService.getUserProfile(userId, loggedInUser, extendedInfo));
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    /**
   * checkDisplayName
   * return users
   */
    static async checkDisplayName(req, res) {

        const displayName = req.params.displayName;
        const userId = req.user.uid;

        if (!displayName) {
            // displayName is not available
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.DISPLAY_NAME_NOT_FOUND);
        }

        if (!userId) {
            // displayName is not available
            Utils.sendResponse(res, interceptorConstants.BAD_REQUEST, ResponseMessagesConstants.USER_ID_NOT_FOUND);
        }

        try {
            let users: User[] = await UserService.getUsersByDisplayName(displayName);

            users = users.filter(user => user.userId !== userId);

            Utils.sendResponse(res, interceptorConstants.SUCCESS, users.length <= 0);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    static async addressSuggestion(req, res) {
        const location = (req.params.location) ? req.params.location : '';
        const apiKey = Utils.getApiKey();
        const options = {
            // tslint:disable-next-line: max-line-length
            url: `${externalUrl.autocompleteUrl}?input=${location}&key=${apiKey}`,
            json: true
        };
        try {
            const requestResponse = await requestPromise(options);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, requestResponse);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    static async addressByLatLang(req, res) {
        const latLong = (req.params.latLong) ? req.params.latLong : '';
        const apiKey = Utils.getApiKey();
        const options = {
            // tslint:disable-next-line: max-line-length
            url: `${externalUrl.geocodeUrl}?latlng=${latLong}&key=${apiKey}`,
            json: true
        };
        try {
            const requestResponse = await requestPromise(options);
            Utils.sendResponse(res, interceptorConstants.SUCCESS, requestResponse);
        } catch (error) {
            Utils.sendError(res, error);
        }
    }

    static async addBitsFirstQuestion(req, res) {
        const userId = req.user.uid;

        if (!userId) {
            Utils.sendResponse(res, interceptorConstants.FORBIDDEN, ResponseMessagesConstants.USER_ID_NOT_FOUND);
        }

        try {
            const account: Account = await AccountService.getAccountById(userId);
            const appSetting = await AppSettings.Instance.getAppSettings();
            const bits = appSetting.first_question_bits;
            if (!account.firstQuestionBitsAdded) {
                await AccountService.updateBits(userId, bits);
            }

            Utils.sendResponse(res, interceptorConstants.SUCCESS, { 'status': ResponseMessagesConstants.BITS_ADDED });

        } catch (error) {
            Utils.sendError(res, error);
        }
    }
}
