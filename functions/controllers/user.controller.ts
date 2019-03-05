

import { UserService } from '../services/user.service';
import { ProfileImagesGenerator } from '../utils/profile-images-generator';
import { MailClient } from '../utils/mail-client';
import { UserControllerConstants, profileSettingsConstants } from '../../projects/shared-library/src/lib/shared/model';
import { Utils } from '../utils/utils';
import { AccountService } from '../services/account.service';

export class UserController {

    /**
     * getUserById
     * return user
     */
    static async getUserById(req, res) {
        const userId = req.params.userId;

        if (!userId) {
            // userId is not available
            return res.status(400).send('Bad Request');
        }
        try {
            res.status(200).send(await UserService.getUserProfile(userId));
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
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
            return res.status(400).send('Bad Request');
        }

        if (!width) {
            // width is not available
            return res.status(400).send('Bad Request');
        }

        if (!height) {
            // height is not available
            return res.status(400).send('Bad Request');
        }


        try {
            const stream = await UserService.getUserProfileImage(userId, width, height);
            res.setHeader('content-disposition', 'attachment; filename=profile_image.png');
            res.setHeader('content-type', 'image/jpeg');
            res.status(200).send(stream);
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }

    /**
     * generateUserProfileImage
     * return status
     */
    static async generateUserProfileImage(req, res) {
        if (req.body.user.userId !== req.user.uid) {
            return res.status(401).send('Unauthorized');
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
                user.bulkUploadPermissionStatus = profileSettingsConstants.NONE;
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

            user.bulkUploadPermissionStatus =
                (user.bulkUploadPermissionStatus) ? user.bulkUploadPermissionStatus : profileSettingsConstants.NONE;

            delete user['roles'];

            await UserService.updateUser({ ...user });
            res.status(200).send({ 'status': 'Profile Data is saved !!' });

        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
        }
    }

    /**
     * updateLives
     * return status
     */
    static async updateLives(req, res) {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).send('Bad Request');
        }
        if (req.user.user_id !== userId) {
            return res.status(401).send('Unauthorized');
        }

        try {
            await AccountService.updateLives(userId);
            res.status(200).send({ 'status': 'Lives added successfully !!' });
        } catch (error) {
            console.error('Error : ', error);
            res.status(500).send('Internal Server error');
        }

    }

}









