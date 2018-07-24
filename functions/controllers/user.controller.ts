
const userService = require('../services/user.service');
const sharp = require('sharp');
import { User, UserStats } from '../../src/app/model';
import { ProfileImagesGenerator } from '../utils/profile-images-generator';

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
    userService.getUserById(req.user.uid).then((u) => {
        const dbUser = u.data();
        profileImagesGenerator.
            getStoredImage(req.user.uid, dbUser.profilePicture).then((status) => {
                res.send({ 'status': 'Images are created !!' })
            })
    });
};
