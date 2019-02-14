

const userService = require('../services/user.service');
const sharp = require('sharp');
import { User, UserStats, UserControllerConstants, profileSettingsConstants } from '../../projects/shared-library/src/lib/shared/model';
import { ProfileImagesGenerator } from '../utils/profile-images-generator';
import { MailClient } from '../utils/mail-client';
import { Utils } from '../utils/utils';
const utils: Utils = new Utils();
const generalAccountService = require('../services/account.service');
/**
 * getUserById
 * return user
 */
exports.getUserById = (req, res) => {
    // console.log('body---->', req.body);
    const userId = req.params.userId;


    if (!userId) {
        // Game Option is not added
        res.status(403).send('userId is not available');
        return;
    }

    userService.getUserById(userId).then((u) => {
        const dbUser = u.data();
        console.log('user--->', dbUser);
        const user = new User();
        user.displayName = (dbUser && dbUser.displayName) ? dbUser.displayName : '';
        user.location = (dbUser && dbUser.location) ? dbUser.location : '';
        user.profilePicture = (dbUser && dbUser.profilePicture) ? dbUser.profilePicture : '';
        user.userId = userId;

        console.log('userinfo--->', user);
        res.send(user);
    });
};


/**
 * getUserImages
 * return user
 */
exports.getUserImages = (req, res) => {
    // console.log('body---->', req.body);
    const userId = req.params.userId;
    const width = req.params.width;
    const height = req.params.height;


    if (!userId) {
        // Game Option is not added
        res.status(403).send('userId is not available');
        return;
    }

    userService.getUserById(userId).then((u) => {
        const dbUser = u.data();
        userService.generateProfileImage(userId, dbUser.profilePicture, `${width}*${height}`).then((stream) => {
            res.setHeader('content-disposition', 'attachment; filename=profile_image.png');
            res.setHeader('content-type', 'image/jpeg');
            res.send(stream);
        });

    });
};

/**
 * generateUserProfileImage
 * return status
 */
exports.generateUserProfileImage = (req, res) => {
    const profileImagesGenerator: ProfileImagesGenerator = new ProfileImagesGenerator();
    const user = req.body.user;

    if (user.profilePicture && user.croppedImageUrl && user.originalImageUrl) {

        profileImagesGenerator.
            uploadProfileImage(user).then((status) => {
                delete user.originalImageUrl;
                delete user.croppedImageUrl;
                delete user.imageType;
                setUser(user, res);
            });

    } else {
        setUser(user, res);
    }
};

function setUser(user, res) {

    if (user.bulkUploadPermissionStatus === profileSettingsConstants.NONE) {
        user.bulkUploadPermissionStatus = profileSettingsConstants.PENDING;
        user.bulkUploadPermissionStatusUpdateTime = utils.getUTCTimeStamp();
        const htmlContent = `<b>${user.displayName}</b> user with id <b>${user.userId}</b> has requested bulk upload access.`;
        const mail: MailClient = new MailClient(UserControllerConstants.adminEmail, UserControllerConstants.mailSubject,
            UserControllerConstants.mailSubject, htmlContent);
        mail.sendMail();
    }

    delete user['roles'];
    userService.setUser(user).then((ref) => {
        res.send({ 'status': 'Profile Data is saved !!' });
    });
}

exports.updateLives = (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
        res.status(400).send('Bad Request');
    }
    return generalAccountService.updateLives(userId).then((ref) => {
        res.send({ 'status': 'Lives added successfully !!' });
    }, error => {
        res.status(500).send(error);
    });

};
